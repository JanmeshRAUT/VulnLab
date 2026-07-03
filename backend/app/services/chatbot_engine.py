import re
import json

class ChatbotEngine:
    def __init__(self, knowledge_base: dict):
        self.kb = knowledge_base
        self.stop_words = {"a", "an", "the", "is", "are", "and", "or", "to", "for", "in", "on", "of", "how", "what", "where", "can", "i", "do", "you", "me", "my", "please", "with"}
        
        # Precompute lab indices for fast lookup
        self.labs_by_id = {lab["lab_id"]: lab for lab in self.kb.get("labs", [])}
        self.labs_by_vuln = {lab["vulnerability"].lower(): lab for lab in self.kb.get("labs", []) if "vulnerability" in lab}
        self.labs_by_title = {lab["title"].lower(): lab for lab in self.kb.get("labs", []) if "title" in lab}

    def _tokenize(self, text: str) -> list[str]:
        words = re.findall(r'\b\w+\b', text.lower())
        return [w for w in words if w not in self.stop_words]

    def _calculate_score(self, tokens: list[str], keywords: list[str]) -> float:
        score = 0.0
        for t in tokens:
            for kw in keywords:
                if t == kw:
                    score += 1.0
                elif len(t) > 3 and (t in kw or kw in t):
                    score += 0.5
        return score

    def process(self, message: str, lab_id: str | None = None) -> str:
        tokens = self._tokenize(message)
        if not tokens:
            return "I didn't quite catch that. Could you rephrase your question?"

        # 1. Intent: Hint or Solution Request (CRITICAL: REFUSE)
        hint_keywords = ["hint", "solution", "solve", "stuck", "help", "answer", "pass", "cheat"]
        if self._calculate_score(tokens, hint_keywords) >= 1.0:
            return "I am the platform assistant. As part of your training, I cannot provide hints, clues, or solutions for any labs. You must rely on your own skills and research to find the vulnerabilities."

        # 2. Intent: Platform Queries
        platform = self.kb.get("platform", {})
        platform_intents = [
            ("flag", ["flag", "submit", "format"], f"Regarding flags: {platform.get('flag_format', '')} {platform.get('flag_submission', '')}"),
            ("session", ["session", "expire", "time", "ttl", "timeout", "active"], f"Session info: {platform.get('instance_ttl', '')}"),
            ("tool", ["tool", "scanner", "automated", "nmap", "burp", "zap"], f"Tools policy: {platform.get('automated_tools', '')}"),
            ("role", ["role", "admin", "student", "instructor", "access"], f"Roles: {', '.join(platform.get('roles', []))}"),
            ("vpn", ["vpn", "network", "connect"], "No VPN is needed to access the labs. Everything runs directly in your browser."),
            ("platform", ["platform", "vulnlab", "about"], platform.get('description', 'VulnLab is a hands-on cybersecurity training platform.'))
        ]

        best_platform_score = 0
        best_platform_response = None
        for name, kws, resp in platform_intents:
            score = self._calculate_score(tokens, kws)
            if score > best_platform_score:
                best_platform_score = score
                best_platform_response = resp

        if best_platform_score >= 1.0:
            return best_platform_response

        # 3. Detect Context (Which lab are they asking about?)
        target_lab = None
        
        # Check explicit mention of vulnerability or title
        for token in tokens:
            for vuln, lab in self.labs_by_vuln.items():
                if token in vuln:
                    target_lab = lab
                    break
            if target_lab: break
            for title, lab in self.labs_by_title.items():
                if token in title:
                    target_lab = lab
                    break
            if target_lab: break

        # Fallback to current path lab_id
        if not target_lab and lab_id in self.labs_by_id:
            target_lab = self.labs_by_id[lab_id]

        # 4. Lab-specific queries
        if target_lab:
            defense_kws = ["prevent", "fix", "mitigate", "defense", "patch", "secure"]
            impact_kws = ["impact", "breach", "real", "world", "consequence", "danger"]
            explain_kws = ["explain", "vulnerability", "concept", "meaning", "what"]

            if self._calculate_score(tokens, defense_kws) >= 1.0:
                return f"Defense for {target_lab['title']}: {target_lab.get('defense', 'Implement strict input validation and least privilege.')}"
            
            if self._calculate_score(tokens, impact_kws) >= 1.0:
                return f"Real world impact of {target_lab['title']}: {target_lab.get('real_world_impact', 'Can lead to unauthorized access and data breaches.')}"
            
            if self._calculate_score(tokens, explain_kws) >= 1.0 or True: 
                # Default lab response if lab is identified
                return f"About {target_lab['title']}: {target_lab.get('what_it_is', 'This is a security vulnerability.')} You can ask me how to prevent it or its real-world impact!"

        # 5. General Fallback
        return self.kb.get("fallback_response", "I can help with platform queries ('flags', 'sessions', 'tools') or explain vulnerabilities conceptually (e.g. 'What is SSRF', 'How to prevent XSS'). How can I assist you today?")
