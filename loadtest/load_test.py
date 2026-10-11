"""
VulnLab Student Load Test Simulation using Locust.

Simulates concurrent student workflows:
1. Student authentication (login or session restore)
2. Lab instance launch / retrieval
3. Periodic heartbeat signals (every 30s)
4. Lab exploration and flag submission
5. Session termination / instance abandonment

Run with:
    pip install locust
    locust -f loadtest/load_test.py --host http://localhost:8000
"""

import time
import uuid
import random
from locust import HttpUser, task, between, events

class VulnLabStudentUser(HttpUser):
    # Simulate realistic thinking and typing intervals between requests
    wait_time = between(2, 5)

    def on_start(self):
        """Prepare student session and launch test lab instance."""
        self.student_id = f"student_{uuid.uuid4().hex[:8]}"
        self.email = f"{self.student_id}@university.edu"
        self.password = "SecureTestPassword123!"
        self.instance_id = None
        self.active_lab = "1"
        self.active_variant = "1"

        # 1. Register student
        reg_res = self.client.post("/api/auth/register", json={
            "email": self.email,
            "password": self.password,
            "full_name": f"Student {self.student_id}",
            "enrollment_id": f"ENR-{self.student_id[:6].upper()}"
        })

        # 2. Login to obtain session cookie
        login_res = self.client.post("/api/auth/login", json={
            "email": self.email,
            "password": self.password
        })

        if login_res.status_code == 200:
            # 3. Launch initial lab instance
            launch_res = self.client.post("/api/instances/launch", json={
                "lab_id": self.active_lab,
                "variant_id": self.active_variant
            })
            if launch_res.status_code == 200:
                data = launch_res.json()
                self.instance_id = data.get("instance_id")

    @task(5)
    def send_heartbeat(self):
        """Send periodic heartbeat to keep the lab container active."""
        if self.instance_id:
            self.client.post(f"/api/instances/{self.instance_id}/heartbeat")

    @task(3)
    def fetch_user_profile_and_status(self):
        """Student navigates profile or dashboard."""
        self.client.get("/api/auth/me")
        self.client.get("/api/auth/status")

    @task(4)
    def interact_with_lab(self):
        """Execute simulated lab interaction."""
        if not self.instance_id:
            return

        headers = {"X-Instance-ID": self.instance_id}
        # Simulate lab 1 image request with traversal
        self.client.get("/api/lab1/1/image?file=product1.png", headers=headers)

    @task(1)
    def attempt_flag_submission(self):
        """Simulate student submitting a flag."""
        if not self.instance_id:
            return

        candidate_flag = f"FLAG{{simulated_test_{random.randint(100, 999)}}}"
        self.client.post("/api/instances/submit-flag", json={
            "instance_id": self.instance_id,
            "flag": candidate_flag
        })

    def on_stop(self):
        """Abandon instance upon student logout/completion."""
        if self.instance_id:
            self.client.post(f"/api/instances/{self.instance_id}/abandon")
