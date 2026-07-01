import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

// ─── Full ordered sequence of every page in the lab system ───────────────────
// Each entry: { path, step?, variant?, label }
// For pages without steps/variants, those fields are omitted.
// "step" refers to the searchParam step, "variant" for lab2 subs (always 'a' as default)

type StepEntry = {
  path: string;
  step?: string;
  label: string;
  breadcrumb: string[];
};

const LAB_SEQUENCE: StepEntry[] = [
  // ── Lab 1 ──────────────────────────────────────────────────────────────────
  { path: '/labs/1', step: 'info',      label: 'Lab 1 · Overview',           breadcrumb: ['Labs', 'Lab 1', 'Overview'] },
  { path: '/labs/1', step: 'selection', label: 'Lab 1 · Target Selection',   breadcrumb: ['Labs', 'Lab 1', 'Select Target'] },
  { path: '/labs/1/sub1',               label: 'Lab 1.1 · DocuVault',         breadcrumb: ['Labs', 'Lab 1', 'Lab 1.1'] },
  { path: '/labs/1/sub2',               label: 'Lab 1.2 · Bean&Brew',        breadcrumb: ['Labs', 'Lab 1', 'Lab 1.2'] },
  { path: '/labs/1/sub3',               label: 'Lab 1.3 · PixelMarket',       breadcrumb: ['Labs', 'Lab 1', 'Lab 1.3'] },

  // ── Lab 2 ──────────────────────────────────────────────────────────────────
  { path: '/labs/2', step: 'info',      label: 'Lab 2 · Overview',           breadcrumb: ['Labs', 'Lab 2', 'Overview'] },
  { path: '/labs/2', step: 'selection', label: 'Lab 2 · Target Selection',   breadcrumb: ['Labs', 'Lab 2', 'Select Target'] },

  { path: '/labs/2/sub1/a', step: 'theory',    label: 'Lab 2.1 · Theory',          breadcrumb: ['Labs', 'Lab 2', 'Lab 2.1', 'Theory'] },
  { path: '/labs/2/sub1/a', step: 'selection', label: 'Lab 2.1 · Variant Selection', breadcrumb: ['Labs', 'Lab 2', 'Lab 2.1', 'Select Variant'] },
  { path: '/labs/2/sub1/a', step: 'lab',       label: 'Lab 2.1 · Lab Environment',  breadcrumb: ['Labs', 'Lab 2', 'Lab 2.1', 'Lab'] },

  { path: '/labs/2/sub2/a', step: 'theory',    label: 'Lab 2.2 · Theory',          breadcrumb: ['Labs', 'Lab 2', 'Lab 2.2', 'Theory'] },
  { path: '/labs/2/sub2/a', step: 'selection', label: 'Lab 2.2 · Variant Selection', breadcrumb: ['Labs', 'Lab 2', 'Lab 2.2', 'Select Variant'] },
  { path: '/labs/2/sub2/a', step: 'lab',       label: 'Lab 2.2 · Lab Environment',  breadcrumb: ['Labs', 'Lab 2', 'Lab 2.2', 'Lab'] },

  { path: '/labs/2/sub3/a', step: 'theory',    label: 'Lab 2.3 · Theory',          breadcrumb: ['Labs', 'Lab 2', 'Lab 2.3', 'Theory'] },
  { path: '/labs/2/sub3/a', step: 'selection', label: 'Lab 2.3 · Variant Selection', breadcrumb: ['Labs', 'Lab 2', 'Lab 2.3', 'Select Variant'] },
  { path: '/labs/2/sub3/a', step: 'lab',       label: 'Lab 2.3 · Lab Environment',  breadcrumb: ['Labs', 'Lab 2', 'Lab 2.3', 'Lab'] },

  { path: '/labs/2/sub4/a', step: 'theory',    label: 'Lab 2.4 · Theory',          breadcrumb: ['Labs', 'Lab 2', 'Lab 2.4', 'Theory'] },
  { path: '/labs/2/sub4/a', step: 'selection', label: 'Lab 2.4 · Variant Selection', breadcrumb: ['Labs', 'Lab 2', 'Lab 2.4', 'Select Variant'] },
  { path: '/labs/2/sub4/a', step: 'lab',       label: 'Lab 2.4 · Lab Environment',  breadcrumb: ['Labs', 'Lab 2', 'Lab 2.4', 'Lab'] },

  { path: '/labs/2/sub5/a', step: 'theory',    label: 'Lab 2.5 · Theory',          breadcrumb: ['Labs', 'Lab 2', 'Lab 2.5', 'Theory'] },
  { path: '/labs/2/sub5/a', step: 'selection', label: 'Lab 2.5 · Variant Selection', breadcrumb: ['Labs', 'Lab 2', 'Lab 2.5', 'Select Variant'] },
  { path: '/labs/2/sub5/a', step: 'lab',       label: 'Lab 2.5 · Lab Environment',  breadcrumb: ['Labs', 'Lab 2', 'Lab 2.5', 'Lab'] },

  // ── Lab 3 ──────────────────────────────────────────────────────────────────
  { path: '/labs/3',       label: 'Lab 3 · Overview',          breadcrumb: ['Labs', 'Lab 3', 'Overview'] },

  { path: '/labs/3/sub1', step: 'theory',    label: 'Lab 3.1 · Theory',          breadcrumb: ['Labs', 'Lab 3', 'Lab 3.1', 'Theory'] },
  { path: '/labs/3/sub1', step: 'selection', label: 'Lab 3.1 · Variant Selection', breadcrumb: ['Labs', 'Lab 3', 'Lab 3.1', 'Select Variant'] },
  { path: '/labs/3/sub1', step: 'lab',       label: 'Lab 3.1 · Lab Environment',  breadcrumb: ['Labs', 'Lab 3', 'Lab 3.1', 'Lab'] },

  { path: '/labs/3/sub2', step: 'theory',    label: 'Lab 3.2 · Theory',          breadcrumb: ['Labs', 'Lab 3', 'Lab 3.2', 'Theory'] },
  { path: '/labs/3/sub2', step: 'selection', label: 'Lab 3.2 · Variant Selection', breadcrumb: ['Labs', 'Lab 3', 'Lab 3.2', 'Select Variant'] },
  { path: '/labs/3/sub2', step: 'lab',       label: 'Lab 3.2 · Lab Environment',  breadcrumb: ['Labs', 'Lab 3', 'Lab 3.2', 'Lab'] },
];

// Helper: normalise the path for comparison (strip trailing slash, lowercase)
function normPath(p: string) {
  // For lab2 sub paths with variantId, strip the variant so we can match generically
  // e.g. /labs/2/sub1/b  →  /labs/2/sub1/a
  return p.replace(/\/labs\/2\/sub(\d+)\/[a-c]/, '/labs/2/sub$1/a')
          .replace(/\/$/, '')
          .toLowerCase();
}

// Find current index in the sequence
function findCurrentIndex(pathname: string, searchParams: URLSearchParams): number {
  const normCurrent = normPath(pathname);
  const currentStep = searchParams.get('step') || undefined;

  return LAB_SEQUENCE.findIndex(entry => {
    const normEntry = normPath(entry.path);
    if (normEntry !== normCurrent) return false;
    // If the entry has a step, it must match
    if (entry.step !== undefined) return entry.step === currentStep;
    // If entry has no step, the page should also have no step (or step is absent)
    return currentStep === null || currentStep === undefined;
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

interface LabStepNavProps {
  /** Pass current step if this page uses search-param steps (e.g. 'theory', 'selection', 'lab') */
  currentStep?: string;
  /** Override: if the user is on a variant page, pass the actual variantId so back-nav is correct */
  variantId?: string;
  /** Compact mode shows only the prev/next row without the progress bar */
  compact?: boolean;
}

export default function LabStepNav({ compact = false }: LabStepNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentIndex = findCurrentIndex(location.pathname, searchParams);

  if (currentIndex === -1) return null; // not in the sequence

  const current = LAB_SEQUENCE[currentIndex];
  const prev    = currentIndex > 0                          ? LAB_SEQUENCE[currentIndex - 1] : null;
  const next    = currentIndex < LAB_SEQUENCE.length - 1   ? LAB_SEQUENCE[currentIndex + 1] : null;

  const goTo = (entry: StepEntry) => {
    // Preserve the current variant for lab2 pages if possible
    const currentVariant = searchParams.get('variant') || 'a';
    let url = entry.path;
    // For lab2 variant paths: keep using the selected variant from current state
    if (entry.path.includes('/labs/2/sub') && entry.path.match(/\/[abc]$/)) {
      url = entry.path.replace(/\/[abc]$/, `/${currentVariant}`);
    }
    if (entry.step) {
      // Always preserve variant for lab2 sub pages
      const isLab2Sub = url.includes('/labs/2/sub');
      navigate(`${url}?step=${entry.step}${isLab2Sub ? `&variant=${currentVariant}` : ''}`);
    } else {
      navigate(url);
    }
  };

  const progress = Math.round(((currentIndex + 1) / LAB_SEQUENCE.length) * 100);

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      {/* Progress bar */}
      {!compact && (
        <div className="h-1 bg-slate-100 w-full">
          <div
            className="h-1 bg-brand-orange transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="w-full px-6 py-3 flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium flex-wrap">
          {current.breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
              <span className={i === current.breadcrumb.length - 1 ? 'text-brand-orange font-bold' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* Step counter (mobile) */}
        <div className="md:hidden text-xs text-slate-500 font-bold">
          Step {currentIndex + 1} / {LAB_SEQUENCE.length}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button
            onClick={() => prev && goTo(prev)}
            disabled={!prev}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              prev
                ? 'border-slate-200 text-slate-700 hover:border-brand-orange hover:text-brand-orange bg-white'
                : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
            }`}
            title={prev ? `Previous: ${prev.label}` : 'No previous step'}
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Current step pill */}
          <span className="hidden lg:inline-flex items-center px-3 py-1.5 bg-brand-orange-50 border border-orange-200 text-brand-orange font-bold text-xs rounded-full">
            {currentIndex + 1} / {LAB_SEQUENCE.length}
          </span>

          <button
            onClick={() => next && goTo(next)}
            disabled={!next}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              next
                ? 'border-brand-orange bg-brand-orange text-white hover:bg-orange-600 shadow-sm'
                : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
            }`}
            title={next ? `Next: ${next.label}` : 'No next step'}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
