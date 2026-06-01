# MongoDB integration for Flask app
# Stores users, progress, and lab enrollments.
from pymongo import MongoClient, ASCENDING
import os
import uuid
import time
import secrets

# Load .env so DATABASE_URL / MONGO_URI are available even when this module
# is imported before the Flask app has a chance to call load_dotenv().
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# Accept either MONGO_URI (explicit) or DATABASE_URL (used in .env).
MONGO_URI = (
    os.environ.get('MONGO_URI')
    or os.environ.get('DATABASE_URL')
    or 'mongodb://localhost:27017/'
)
MONGO_DB = os.environ.get('MONGO_DB', 'vuln_ecommerce')

try:
    import certifi
    ca = certifi.where()
except ImportError:
    ca = None


def _build_client(uri):
    client_kwargs = {
        'serverSelectionTimeoutMS': 3000,
        'connectTimeoutMS': 3000,
        'socketTimeoutMS': 20000,
        'connect': False,
    }

    if uri.startswith('mongodb+srv://'):
        client_kwargs['tls'] = True
        if ca:
            client_kwargs['tlsCAFile'] = ca

    return MongoClient(uri, **client_kwargs)


try:
    client = _build_client(MONGO_URI)
except Exception:
    fallback_uri = os.environ.get('MONGO_FALLBACK_URI', 'mongodb://localhost:27017/')
    client = _build_client(fallback_uri)

db = client[MONGO_DB]

def ensure_indexes():
    """Best-effort index creation that can be run in the background."""
    try:
        db.users.create_index([('email', ASCENDING)], unique=True, background=True)
        db.users.create_index([('username', ASCENDING)], unique=True, background=True)
        db.users.create_index([('enrollment_id', ASCENDING)], background=True)
        db.progress.create_index([('email', ASCENDING), ('lab_id', ASCENDING), ('variant_id', ASCENDING)], background=True)
        db.progress.create_index([('email', ASCENDING), ('lab_id', ASCENDING)], background=True)
        db.progress.create_index([('instance_id', ASCENDING)], background=True)
        db.enrollments.create_index([('email', ASCENDING), ('lab_id', ASCENDING)], background=True)
        db.instances.create_index([('instance_id', ASCENDING)], unique=True, background=True)
    except Exception:
        pass  # indexes may already exist or Mongo may be unavailable during boot

# ── User helpers ──────────────────────────────────────────────────────────────

def insert_user(user_data):
    """Insert a new user document into users collection."""
    return db.users.insert_one(user_data)


def find_user_by_email(email):
    """Return user dict by email, or None."""
    if not email:
        return None
    return db.users.find_one({'email': email.strip().lower()})


def find_user_by_username(username):
    """Return user dict by username (case-insensitive), or None."""
    if not username:
        return None
    return db.users.find_one({'username': {'$regex': f'^{username.strip()}$', '$options': 'i'}})


def find_user_by_enrollment_id(enrollment_id):
    """Return user dict by enrollment_id, or None."""
    if not enrollment_id:
        return None
    return db.users.find_one({'enrollment_id': enrollment_id.strip().upper()})


def upsert_user(email, username, role='user', full_name=None, guid=None,
                enrollment_id=None, is_approved=True, profile_picture=None,
                user_id=None):
    """Create or update a user document. Returns the updated user dict."""
    email = (email or '').strip().lower()
    if not email:
        return None

    update_fields = {
        'email': email,
        'username': username,
        'role': role,
        'is_approved': is_approved,
    }
    if full_name is not None:
        update_fields['full_name'] = full_name
    if guid is not None:
        update_fields['guid'] = guid
    if enrollment_id is not None:
        update_fields['enrollment_id'] = enrollment_id
    if profile_picture is not None:
        update_fields['profile_picture'] = profile_picture
    if user_id is not None:
        update_fields['user_id'] = user_id

    db.users.update_one(
        {'email': email},
        {'$set': update_fields},
        upsert=True
    )
    return db.users.find_one({'email': email})


def get_all_users():
    """Return list of all user documents."""
    return list(db.users.find({}))


def update_user_access(email, is_approved, role=None):
    """Approve or revoke a user and optionally change their role."""
    update = {'is_approved': is_approved}
    if role:
        update['role'] = role
    result = db.users.update_one({'email': email}, {'$set': update})
    return result.modified_count > 0


# ── Progress helpers ──────────────────────────────────────────────────────────

def _variant_objective_count_for_instance(instance: dict, variant_id: str) -> int:
    records = instance.get('state', {}).get('flag_records', []) if instance else []
    if not records:
        return 0
    if not variant_id:
        return len(records)
    suffix = f":{variant_id}"
    variant_records = [item for item in records if str(item.get('objective_id', '')).endswith(suffix)]
    return len(variant_records) if variant_records else len(records)


def _resolve_variant_id(lab_id: str, section_id: str, instance_id: str = None) -> str:
    if instance_id:
        instance = get_instance(instance_id)
        if instance and instance.get('variant_id'):
            return str(instance.get('variant_id'))
    section_text = str(section_id or '')
    if ':' in section_text:
        return section_text.split(':', 1)[1] or 'default'
    return 'default'


def _resolve_objective_id(lab_id: str, section_id: str) -> str:
    text = str(section_id or '').strip()
    if text:
        return text
    return f"{lab_id}:default"

def get_user_progress(email):
    """Return {lab_id: {variant_id: progress_doc}} for a user."""
    docs = db.progress.find({'email': email})
    result = {}
    for doc in docs:
        lab_id = doc.get('lab_id')
        variant_id = doc.get('variant_id') or 'default'
        if not lab_id:
            continue
        result.setdefault(lab_id, {})[variant_id] = doc
    return result


def get_all_users_progress():
    """Return {email: {lab_id: {variant_id: progress_doc}}} for all users."""
    result = {}
    for doc in db.progress.find({}):
        email = doc.get('email')
        lab_id = doc.get('lab_id')
        variant_id = doc.get('variant_id') or 'default'
        if email and lab_id:
            result.setdefault(email, {}).setdefault(lab_id, {})[variant_id] = doc
    return result


def submit_lab_progress(email, lab_id, section_id, flag, is_solved, note='', instance_id=None):
    """Upsert variant-scoped objective progress.

    Canonical shape: User -> Lab -> Variant -> Objective.
    Tracks attempts, solved objectives, completion %, solve time, hint usage, last activity.
    """
    now = time.time()
    variant_id = _resolve_variant_id(lab_id, section_id, instance_id)
    objective_id = _resolve_objective_id(lab_id, section_id)

    filter_doc = {
        'email': email,
        'lab_id': lab_id,
        'variant_id': variant_id,
    }

    progress_doc = db.progress.find_one(filter_doc) or {}
    objectives = dict(progress_doc.get('objectives', {}))
    objective = dict(objectives.get(objective_id, {}))

    previous_attempts = int(objective.get('attempts', 0))
    previous_hints = int(objective.get('hint_usage', 0))
    already_solved = bool(objective.get('is_solved', False))

    objective['objective_id'] = objective_id
    objective['attempts'] = previous_attempts + 1
    objective['hint_usage'] = previous_hints
    objective['last_activity'] = now
    objective['updated_at'] = now
    objective['flag'] = flag
    objective['note'] = note
    if instance_id:
        objective['instance_id'] = instance_id
    if is_solved and not already_solved:
        objective['is_solved'] = True
        objective['solved_at'] = now
        if instance_id:
            instance = get_instance(instance_id)
            if instance and instance.get('created_at'):
                objective['solve_time'] = max(0.0, now - float(instance.get('created_at')))
    else:
        objective.setdefault('is_solved', already_solved)
        objective.setdefault('solved_at', objective.get('solved_at'))
        if 'solve_time' in objective and objective['solve_time'] is None:
            objective.pop('solve_time', None)

    objectives[objective_id] = objective

    solved_objectives = sorted([
        key for key, value in objectives.items()
        if bool(value.get('is_solved'))
    ])
    total_attempts = sum(int(value.get('attempts', 0)) for value in objectives.values())

    total_objectives = len(objectives)
    if instance_id:
        instance = get_instance(instance_id)
        total_objectives = max(total_objectives, _variant_objective_count_for_instance(instance, variant_id))

    completion_percentage = 0.0
    if total_objectives > 0:
        completion_percentage = round((len(solved_objectives) / total_objectives) * 100, 1)

    set_doc = {
        'schema_version': 2,
        'email': email,
        'lab_id': lab_id,
        'variant_id': variant_id,
        'objectives': objectives,
        'attempts': total_attempts,
        'solved_objectives': solved_objectives,
        'completion_percentage': completion_percentage,
        'total_objectives': total_objectives,
        'last_activity': now,
        'updated_at': now,
    }
    if instance_id:
        set_doc['instance_id'] = instance_id

    # Compatibility fields used by legacy readers.
    set_doc['section_id'] = objective_id
    set_doc['flag'] = flag
    set_doc['is_solved'] = bool(is_solved)
    set_doc['note'] = note

    db.progress.update_one(
        filter_doc,
        {'$set': set_doc},
        upsert=True,
    )


def record_hint_usage(email, lab_id, variant_id, objective_id, count=1, instance_id=None):
    """Increment hint usage for a specific objective in variant-scoped progress."""
    if not email or not lab_id or not objective_id:
        return

    now = time.time()
    normalized_variant = (variant_id or 'default').strip() or 'default'
    filter_doc = {
        'email': email,
        'lab_id': lab_id,
        'variant_id': normalized_variant,
    }

    progress_doc = db.progress.find_one(filter_doc) or {}
    objectives = dict(progress_doc.get('objectives', {}))
    objective = dict(objectives.get(objective_id, {}))

    objective['objective_id'] = objective_id
    objective['hint_usage'] = int(objective.get('hint_usage', 0)) + max(1, int(count or 1))
    objective['last_activity'] = now
    objective['updated_at'] = now
    objective.setdefault('attempts', int(objective.get('attempts', 0)))
    objective.setdefault('is_solved', bool(objective.get('is_solved', False)))
    if instance_id:
        objective['instance_id'] = instance_id

    objectives[objective_id] = objective
    solved_objectives = sorted([
        key for key, value in objectives.items()
        if bool(value.get('is_solved'))
    ])
    total_attempts = sum(int(value.get('attempts', 0)) for value in objectives.values())
    total_objectives = max(len(objectives), int(progress_doc.get('total_objectives', 0) or 0))
    completion_percentage = round((len(solved_objectives) / total_objectives) * 100, 1) if total_objectives else 0.0

    set_doc = {
        'schema_version': 2,
        'email': email,
        'lab_id': lab_id,
        'variant_id': normalized_variant,
        'objectives': objectives,
        'attempts': total_attempts,
        'solved_objectives': solved_objectives,
        'completion_percentage': completion_percentage,
        'total_objectives': total_objectives,
        'last_activity': now,
        'updated_at': now,
    }
    if instance_id:
        set_doc['instance_id'] = instance_id

    db.progress.update_one(filter_doc, {'$set': set_doc}, upsert=True)


def get_solved_labs_feed():
    """Return all solved progress records."""
    docs = list(db.progress.find({}))
    solved = []
    for doc in docs:
        if doc.get('schema_version') == 2:
            objectives = doc.get('objectives', {})
            for objective_id, objective in objectives.items():
                if objective.get('is_solved'):
                    solved.append({
                        'email': doc.get('email'),
                        'lab_id': doc.get('lab_id'),
                        'variant_id': doc.get('variant_id', 'default'),
                        'section_id': objective_id,
                        'flag': objective.get('flag'),
                        'is_solved': True,
                        'updated_at': objective.get('updated_at', doc.get('updated_at')),
                    })
        elif doc.get('is_solved'):
            solved.append(doc)
    return solved


# ── Enrollment helpers ────────────────────────────────────────────────────────

def get_user_lab_enrollments(email):
    """Return list of lab enrollment docs for a user (all approved)."""
    return list(db.enrollments.find({'email': email}))


def get_all_lab_enrollments():
    """Return {email: [enrollment_docs]} for all users."""
    result = {}
    for doc in db.enrollments.find({}):
        email = doc.get('email')
        if email:
            result.setdefault(email, []).append(doc)
    return result


def get_lab_enrollment(email, lab_id):
    """Return a single enrollment doc, or None."""
    return db.enrollments.find_one({'email': email, 'lab_id': lab_id})


def replace_user_lab_access(email, lab_id_list):
    """Replace all enrollments for a user with the provided lab IDs."""
    db.enrollments.delete_many({'email': email})
    for lab_id in lab_id_list:
        db.enrollments.update_one(
            {'email': email, 'lab_id': lab_id},
            {'$set': {
                'email': email,
                'lab_id': lab_id,
                'approval_status': 'approved',
                'updated_at': time.time(),
            }},
            upsert=True
        )
    return True


def update_lab_enrollment_status(email, lab_id, status):
    """Set approval_status on an enrollment."""
    db.enrollments.update_one(
        {'email': email, 'lab_id': lab_id},
        {'$set': {'approval_status': status, 'updated_at': time.time()}},
        upsert=True
    )


def log_session_event(instance_id, user_id, event_type, detail=None):
    """Persist lifecycle session events for admin audit and monitoring."""
    if not instance_id or not event_type:
        return
    now = time.time()
    doc = {
        'instance_id': instance_id,
        'user_id': user_id or 'system',
        'event_type': str(event_type).upper(),
        'detail': detail or {},
        'timestamp': now,
        'module': 'Sessions',
    }
    try:
        db.session_events.insert_one(doc)
    except Exception:
        return


# ── Lab Instances helpers ──────────────────────────────────────────────────────

INSTANCE_ACTIVE_TTL_SECONDS = 300
INSTANCE_TERMINAL_TTL_SECONDS = 300


def _new_instance_id() -> str:
    # 192-bit URL-safe token, independent from user/lab identity.
    return secrets.token_urlsafe(24)


def _compute_expiry(now_ts: float, ttl_seconds: int) -> float:
    return now_ts + float(ttl_seconds)


def _new_flag_value() -> str:
    # 48 bits rendered as 12 uppercase hex chars, wrapped with FLAG{}.
    return f"FLAG{{{secrets.token_hex(6).upper()}}}"


def _is_flag_value_used(flag_value: str) -> bool:
    return db.instances.find_one({'state.flag_records.flag_value': flag_value}) is not None


def issue_instance_flag(instance_id, objective_id):
    """Issue or return a per-instance flag record for an objective.

    Record schema:
      objective_id, flag_value, issued_at, solved_status, solved_at
    """
    if not instance_id or not objective_id:
        return None

    instance = get_instance(instance_id)
    if not instance:
        return None

    existing_records = instance.get('state', {}).get('flag_records', [])
    for record in existing_records:
        if record.get('objective_id') == objective_id:
            return record

    flag_value = _new_flag_value()
    while _is_flag_value_used(flag_value):
        flag_value = _new_flag_value()

    now = time.time()
    record = {
        'objective_id': objective_id,
        'flag_value': flag_value,
        'issued_at': now,
        'solved_status': False,
        'solved_at': None,
    }

    result = db.instances.update_one(
        {
            'instance_id': instance_id,
            'state.flag_records': {'$not': {'$elemMatch': {'objective_id': objective_id}}},
        },
        {
            '$push': {'state.flag_records': record},
            '$addToSet': {'state.flags': flag_value},
        },
    )

    if result.modified_count == 0:
        # Another request may have created it concurrently; read authoritative record.
        refreshed = get_instance(instance_id)
        for item in refreshed.get('state', {}).get('flag_records', []):
            if item.get('objective_id') == objective_id:
                return item
        return None

    return record


def mark_instance_flag_solved(instance_id, flag_value):
    """Mark a specific instance flag record as solved."""
    if not instance_id or not flag_value:
        return False

    now = time.time()
    result = db.instances.update_one(
        {
            'instance_id': instance_id,
            'state.flag_records.flag_value': flag_value,
            'state.flag_records.solved_status': {'$ne': True},
        },
        {
            '$set': {
                'state.flag_records.$.solved_status': True,
                'state.flag_records.$.solved_at': now,
            }
        },
    )
    return result.modified_count > 0


def create_instance(user_id, lab_id, variant_id):
    """Create a new isolated lab instance document.

    This never reuses or mutates prior instances, allowing concurrent sessions
    for the same user/lab/variant.
    """
    now = time.time()
    instance_id = _new_instance_id()

    # Guard against extremely rare token collisions.
    while db.instances.find_one({'instance_id': instance_id}):
        instance_id = _new_instance_id()

    doc = {
        'instance_id': instance_id,
        'user_id': user_id,
        'lab_id': lab_id,
        'variant_id': variant_id,
        'status': 'CREATED',
        'created_at': now,
        'started_at': None,
        'solved_at': None,
        'last_seen': now,
        'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS),
        'state': {},  # For isolated lab state (e.g., deleted users)
    }
    db.instances.insert_one(doc)
    log_session_event(instance_id, user_id, 'CREATED', {'lab_id': lab_id, 'variant_id': variant_id})
    return doc

def get_instance(instance_id):
    """Retrieve an instance document by instance_id."""
    if not instance_id:
        return None
    return db.instances.find_one({'instance_id': instance_id})

def update_instance_status(instance_id, status):
    """Transition an instance status while maintaining lifecycle timestamps."""
    now = time.time()
    status = (status or '').upper()

    update_fields = {
        'status': status,
        'last_seen': now,
    }

    if status == 'ACTIVE':
        update_fields['expires_at'] = _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS)
    elif status == 'SOLVED':
        update_fields['solved_at'] = now
        update_fields['expires_at'] = _compute_expiry(now, INSTANCE_TERMINAL_TTL_SECONDS)
    elif status == 'ABANDONED':
        update_fields['expires_at'] = _compute_expiry(now, INSTANCE_TERMINAL_TTL_SECONDS)
    elif status == 'EXPIRED':
        update_fields['expires_at'] = now

    result = db.instances.update_one(
        {'instance_id': instance_id},
        {'$set': update_fields, '$setOnInsert': {'created_at': now}},
        upsert=False,
    )

    current = get_instance(instance_id)
    if current:
        log_session_event(
            instance_id,
            current.get('user_id', 'system'),
            status,
            {'lab_id': current.get('lab_id'), 'variant_id': current.get('variant_id')},
        )

    # started_at is captured once at first transition out of CREATED.
    if status in {'ACTIVE', 'SOLVED', 'ABANDONED'}:
        db.instances.update_one(
            {'instance_id': instance_id, 'started_at': None},
            {'$set': {'started_at': now}},
        )

    # solved_at should remain immutable once set.
    if status == 'SOLVED':
        db.instances.update_one(
            {'instance_id': instance_id, 'solved_at': {'$exists': False}},
            {'$set': {'solved_at': now}},
        )

    if status == 'ABANDONED':
        cleanup_instance_runtime(instance_id, reason='abandoned')
    elif status == 'EXPIRED':
        cleanup_instance_runtime(instance_id, reason='expired')

    return result.modified_count > 0


def cleanup_instance_runtime(instance_id, reason='expired'):
    """Cleanup temporary/runtime data and close active objectives for terminal instances."""
    instance = get_instance(instance_id)
    if not instance:
        return False

    now = time.time()
    flag_records = []
    closed_objectives = []

    for record in instance.get('state', {}).get('flag_records', []):
        item = dict(record)
        if not item.get('solved_status'):
            item['closed_status'] = True
            item['closed_at'] = now
            closed_objectives.append(item.get('objective_id'))
        flag_records.append(item)

    db.instances.update_one(
        {'instance_id': instance_id},
        {
            '$set': {
                'state.flag_records': flag_records,
                'state.active_objectives': [],
                'state.closed_objectives': [x for x in closed_objectives if x],
                'state.resources': {
                    'released': True,
                    'released_at': now,
                    'reason': reason,
                },
                'cleanup': {
                    'performed_at': now,
                    'reason': reason,
                },
            },
            '$unset': {
                'state.runtime': '',
                'state.temp_session_data': '',
                'state.session_cache': '',
                'state.ephemeral': '',
            }
        },
    )

    # Remove per-instance temporary progress/runtime traces while keeping canonical records.
    db.progress.update_many(
        {'instance_id': instance_id},
        {'$set': {'runtime_closed': True, 'runtime_closed_at': now}},
    )
    instance = get_instance(instance_id)
    log_session_event(
        instance_id,
        (instance or {}).get('user_id', 'system'),
        'CLEANUP',
        {'reason': reason, 'closed_objectives': len([x for x in closed_objectives if x])},
    )
    return True

def heartbeat_instance(instance_id):
    """Update last_seen and transition CREATED -> ACTIVE.

    Returns the updated document when heartbeat is accepted, otherwise None
    (for terminal states like SOLVED/ABANDONED/EXPIRED).
    """
    now = time.time()
    base_filter = {
        'instance_id': instance_id,
        'status': {'$in': ['CREATED', 'ACTIVE']},
    }

    db.instances.update_one(
        base_filter,
        {
            '$set': {
                'last_seen': now,
                'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS),
            }
        },
    )

    db.instances.update_one(
        {'instance_id': instance_id, 'status': 'CREATED'},
        {
            '$set': {
                'status': 'ACTIVE',
                'started_at': now,
                'last_seen': now,
                'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS),
            }
        },
    )

    return db.instances.find_one({'instance_id': instance_id})

def mark_expired_instances(timeout_seconds=300):  # 5 minutes default
    """Advance lifecycle: ACTIVE/CREATED stale -> ABANDONED -> EXPIRED."""
    now = time.time()
    active_ttl = int(timeout_seconds or INSTANCE_ACTIVE_TTL_SECONDS)
    terminal_ttl = int(timeout_seconds or INSTANCE_TERMINAL_TTL_SECONDS)

    active_cutoff = now - active_ttl

    # 1) Missed heartbeat transitions active sessions to ABANDONED with cleanup.
    stale_active = list(db.instances.find(
        {
            'status': {'$in': ['CREATED', 'ACTIVE']},
            '$or': [
                {'last_seen': {'$lt': active_cutoff}},
                {'expires_at': {'$lt': now}},
            ],
        },
        {'instance_id': 1},
    ))
    for row in stale_active:
        iid = row.get('instance_id')
        if not iid:
            continue
        update_instance_status(iid, 'ABANDONED')

    # 2) Terminal sessions become EXPIRED when their own expiry is reached.
    terminal_cutoff = now - terminal_ttl
    stale_terminal = list(db.instances.find(
        {
            'status': {'$in': ['ABANDONED', 'SOLVED']},
            '$or': [
                {'expires_at': {'$lte': now}},
                {'last_seen': {'$lt': terminal_cutoff}},
            ],
        },
        {'instance_id': 1},
    ))
    for row in stale_terminal:
        iid = row.get('instance_id')
        if not iid:
            continue
        update_instance_status(iid, 'EXPIRED')

def update_instance_state(instance_id, key, value):
    """Set a custom state variable for an instance (e.g. tracking deleted users)."""
    db.instances.update_one(
        {'instance_id': instance_id},
        {'$set': {f'state.{key}': value}}
    )
