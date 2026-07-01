from app.models.catalog import Lab, LabVariant

LAB_CATALOG = [
    Lab(
        lab_id="1",
        title="Path Traversal",
        description="Learn about path traversal vulnerabilities.",
        variants=[
            LabVariant(variant_id="1", title="DocuVault", description="Path traversal in file download."),
            LabVariant(variant_id="2", title="ShopExpress", description="Path traversal via image loader."),
            LabVariant(variant_id="3", title="PixelMarket", description="Advanced path traversal via image loader.")
        ]
    ),
    Lab(
        lab_id="2",
        title="Broken Authentication",
        description="Exploit flaws in authentication and session management.",
        variants=[
            LabVariant(variant_id="1a", title="GadgetShop", description="Basic broken auth.", submodule="Basic Broken Authentication"),
            LabVariant(variant_id="1b", title="BookStore", description="Basic broken auth.", submodule="Basic Broken Authentication"),
            LabVariant(variant_id="1c", title="TechZone", description="Basic broken auth.", submodule="Basic Broken Authentication"),
            LabVariant(variant_id="2a", title="BlogHub", description="Hidden broken auth.", submodule="Hidden Authentication"),
            LabVariant(variant_id="2b", title="ForumNext", description="Hidden broken auth.", submodule="Hidden Authentication"),
            LabVariant(variant_id="2c", title="DevPortal", description="Hidden broken auth.", submodule="Hidden Authentication"),
            LabVariant(variant_id="3a", title="ShopEase", description="Cookie-based auth bypass.", submodule="Cookie Exploitation"),
            LabVariant(variant_id="3b", title="MarketPro", description="Cookie-based auth bypass.", submodule="Cookie Exploitation"),
            LabVariant(variant_id="3c", title="CartBuddy", description="Cookie-based auth bypass.", submodule="Cookie Exploitation"),
            LabVariant(variant_id="4a", title="Idor-Blog", description="IDOR vulnerability.", submodule="Insecure Direct Object Reference (IDOR)"),
            LabVariant(variant_id="4b", title="Idor-Shop", description="IDOR vulnerability.", submodule="Insecure Direct Object Reference (IDOR)"),
            LabVariant(variant_id="4c", title="Idor-Support", description="IDOR vulnerability.", submodule="Insecure Direct Object Reference (IDOR)"),
            LabVariant(variant_id="5a", title="SaaSDesk", description="Advanced broken auth.", submodule="Level 5 Advanced Auth"),
            LabVariant(variant_id="5b", title="CloudPanel", description="Advanced broken auth.", submodule="Level 5 Advanced Auth"),
            LabVariant(variant_id="5c", title="WorkflowX", description="Advanced broken auth.", submodule="Level 5 Advanced Auth")
        ]
    ),
    Lab(
        lab_id="3",
        title="Brute Force",
        description="Test rate limiting and brute force protections.",
        variants=[
            LabVariant(variant_id="a", title="SecureShop", description="Brute force login."),
            LabVariant(variant_id="b", title="VaultMart", description="Brute force login."),
            LabVariant(variant_id="c", title="AlphaCart", description="Brute force login.")
        ]
    ),
    Lab(
        lab_id="4",
        title="Server-Side Request Forgery",
        description="Probe internal services and trust boundaries from the server side.",
        variants=[
            LabVariant(variant_id="a", title="ImageProxy", description="SSRF via image fetcher."),
            LabVariant(variant_id="b", title="WebhookHook", description="SSRF via webhook.")
        ]
    ),
    Lab(
        lab_id="5",
        title="File Upload Exploitation",
        description="Abuse unrestricted upload flows to bypass validations, upload malicious payloads.",
        variants=[
            LabVariant(variant_id="a", title="AvatarUpload", description="Unrestricted file upload."),
            LabVariant(variant_id="b", title="DocumentVault", description="Extension bypass.")
        ]
    ),
    Lab(
        lab_id="6",
        title="Command Injection",
        description="Execute arbitrary commands on the host OS.",
        variants=[
            LabVariant(variant_id="a", title="MegaMart", description="Command injection via forms."),
            LabVariant(variant_id="b", title="AutoParts Pro", description="Command injection via forms."),
            LabVariant(variant_id="c", title="Tech Tools", description="Command injection via forms.")
        ]
    ),
    Lab(
        lab_id="7",
        title="SQL Injection",
        description="Interfere with the queries the application makes to its database.",
        variants=[
            LabVariant(variant_id="a", title="Gift Shop", description="Classic SQLi.", submodule="Classic SQLi"),
            LabVariant(variant_id="b", title="Book Store", description="Classic SQLi.", submodule="Classic SQLi"),
            LabVariant(variant_id="c", title="Tech Shop", description="Classic SQLi.", submodule="Classic SQLi"),
            LabVariant(variant_id="blind-a", title="Blind A", description="Blind SQLi.", submodule="Blind SQLi"),
            LabVariant(variant_id="blind-b", title="Blind B", description="Blind SQLi.", submodule="Blind SQLi"),
            LabVariant(variant_id="blind-c", title="Blind C", description="Blind SQLi.", submodule="Blind SQLi")
        ]
    ),
    Lab(
        lab_id="8",
        title="Cross-Site Scripting (XSS)",
        description="Inject malicious scripts into the application to execute arbitrary code.",
        variants=[
            LabVariant(variant_id="a", title="CommentSection", description="Stored XSS."),
            LabVariant(variant_id="b", title="SearchPage", description="Reflected XSS.")
        ]
    ),
]

def get_all_labs():
    return LAB_CATALOG

def get_lab_by_id(lab_id: str):
    for lab in LAB_CATALOG:
        if lab.lab_id == lab_id:
            return lab
    return None
