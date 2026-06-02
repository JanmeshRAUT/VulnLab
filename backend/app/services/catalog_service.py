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
    )
]

def get_all_labs():
    return LAB_CATALOG

def get_lab_by_id(lab_id: str):
    for lab in LAB_CATALOG:
        if lab.lab_id == lab_id:
            return lab
    return None
