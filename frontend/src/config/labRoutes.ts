export interface LabRouteConfig {
  labId: string;
  variantId: string;
  title: string;
  labTitle: string;
}

// Maps 'topic-slug/variant-slug' to their specific config
export const LAB_ROUTES: Record<string, LabRouteConfig> = {
  // Lab 1: Path Traversal
  'path-traversal/docuvault':         { labId: '1', variantId: '1', title: 'Basic Path Traversal', labTitle: 'Lab 1: Path Traversal' },
  'path-traversal/shopexpress':       { labId: '1', variantId: '2', title: 'Bean&Brew', labTitle: 'Lab 1: Path Traversal' },
  'path-traversal/pixelmarket':       { labId: '1', variantId: '3', title: 'Path Traversal (Stripped Non-Recursive)', labTitle: 'Lab 1: Path Traversal' },

  // Lab 2: Broken Authentication & Admin Panels
  'broken-auth/gadgetshop':           { labId: '2', variantId: '1a', title: 'Admin Panel Discovery (GadgetShop)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/bookstore':            { labId: '2', variantId: '1b', title: 'Admin Panel Discovery (BookStore)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/techzone':             { labId: '2', variantId: '1c', title: 'Admin Panel Discovery (TechZone)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth-hidden/BlogHub':       { labId: '2', variantId: '2a', title: 'Hidden Links (BlogHub)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth-hidden/ForumNext':     { labId: '2', variantId: '2b', title: 'Hidden Links (ForumNext)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth-hidden/DevPortal':     { labId: '2', variantId: '2c', title: 'Hidden Links (DevPortal)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/shopease':             { labId: '2', variantId: '3a', title: 'Insecure Cookies (ShopEase)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/marketpro':            { labId: '2', variantId: '3b', title: 'Insecure Cookies (MarketPro)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/cartbuddy':            { labId: '2', variantId: '3c', title: 'Insecure Cookies (CartBuddy)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/idor-blog':            { labId: '2', variantId: '4a', title: 'IDOR Profile Access (Blog)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/idor-shop':            { labId: '2', variantId: '4b', title: 'IDOR Profile Access (Shop)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/idor-support':         { labId: '2', variantId: '4c', title: 'IDOR Profile Access (Support)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/saasdesk':             { labId: '2', variantId: '5a', title: 'IDOR Role Bypass (SaaSDesk)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/cloudpanel':           { labId: '2', variantId: '5b', title: 'IDOR Role Bypass (CloudPanel)', labTitle: 'Lab 2: Broken Authentication' },
  'broken-auth/workflowx':            { labId: '2', variantId: '5c', title: 'IDOR Role Bypass (WorkflowX)', labTitle: 'Lab 2: Broken Authentication' },

  // Lab 3: Authentication Brute Force
  'brute-force/secureshop':           { labId: '3', variantId: '1a', title: 'Brute Force (SecureShop)', labTitle: 'Lab 3.1: Brute Force' },
  'brute-force/vaultmart':            { labId: '3', variantId: '1b', title: 'Brute Force (VaultMart)', labTitle: 'Lab 3.1: Brute Force' },
  'brute-force/alphacart':            { labId: '3', variantId: '1c', title: 'Brute Force (AlphaCart)', labTitle: 'Lab 3.1: Brute Force' },

  // Lab 3.X: Cross-Site Scripting (XSS) - old labeling
  'xss/reflected':                    { labId: '3', variantId: '1', title: 'Reflected XSS', labTitle: 'Lab 3: XSS' },
  'xss/stored':                       { labId: '3', variantId: '2', title: 'Stored XSS', labTitle: 'Lab 3: XSS' },

  // Lab 4: Insecure Direct Object References (IDOR)
  'idor/profile-a':                   { labId: '4', variantId: '1a', title: 'IDOR Profile Access (A)', labTitle: 'Lab 4: IDOR' },
  'idor/profile-b':                   { labId: '4', variantId: '1b', title: 'IDOR Profile Access (B)', labTitle: 'Lab 4: IDOR' },
  'idor/profile-c':                   { labId: '4', variantId: '1c', title: 'IDOR Profile Access (C)', labTitle: 'Lab 4: IDOR' },
  'idor/cart-a':                      { labId: '4', variantId: '2a', title: 'IDOR Cart Modification (A)', labTitle: 'Lab 4: IDOR' },
  'idor/cart-b':                      { labId: '4', variantId: '2b', title: 'IDOR Cart Modification (B)', labTitle: 'Lab 4: IDOR' },
  'idor/cart-c':                      { labId: '4', variantId: '2c', title: 'IDOR Cart Modification (C)', labTitle: 'Lab 4: IDOR' },

  // Lab 5: CSRF
  'csrf/basic-a':                     { labId: '5', variantId: '1a', title: 'Basic CSRF (A)', labTitle: 'Lab 5: CSRF' },
  'csrf/basic-b':                     { labId: '5', variantId: '1b', title: 'Basic CSRF (B)', labTitle: 'Lab 5: CSRF' },
  'csrf/basic-c':                     { labId: '5', variantId: '1c', title: 'Basic CSRF (C)', labTitle: 'Lab 5: CSRF' },
  'csrf/weak-token-a':                { labId: '5', variantId: '2a', title: 'Weak Anti-CSRF Token (A)', labTitle: 'Lab 5: CSRF' },
  'csrf/weak-token-b':                { labId: '5', variantId: '2b', title: 'Weak Anti-CSRF Token (B)', labTitle: 'Lab 5: CSRF' },
  'csrf/weak-token-c':                { labId: '5', variantId: '2c', title: 'Weak Anti-CSRF Token (C)', labTitle: 'Lab 5: CSRF' },

  // Lab 6: Command Injection
  'command-injection/megamart':       { labId: '6', variantId: '1', title: 'Basic Command Injection', labTitle: 'Lab 6: Command Injection' },
  'command-injection/autoparts-pro':  { labId: '6', variantId: '2', title: 'Blind Command Injection', labTitle: 'Lab 6: Command Injection' },
  'command-injection/tech-tools':     { labId: '6', variantId: '3', title: 'Advanced Command Injection', labTitle: 'Lab 6: Command Injection' },

  // Lab 7: SQL Injection
  'sql-injection/gift-shop':          { labId: '7', variantId: '1a', title: 'SQLi Error Based (A)', labTitle: 'Lab 7: SQL Injection' },
  'sql-injection/book-store':         { labId: '7', variantId: '1b', title: 'SQLi Error Based (B)', labTitle: 'Lab 7: SQL Injection' },
  'sql-injection/tech-shop':          { labId: '7', variantId: '1c', title: 'SQLi Error Based (C)', labTitle: 'Lab 7: SQL Injection' },
  'sql-injection/blind-a':            { labId: '7', variantId: '2a', title: 'SQLi Blind (A)', labTitle: 'Lab 7: SQL Injection' },
  'sql-injection/blind-b':            { labId: '7', variantId: '2b', title: 'SQLi Blind (B)', labTitle: 'Lab 7: SQL Injection' },
  'sql-injection/blind-c':            { labId: '7', variantId: '2c', title: 'SQLi Blind (C)', labTitle: 'Lab 7: SQL Injection' },

  // Lab 8: Deserialization
  'deserialization/basic-a':          { labId: '8', variantId: '1a', title: 'Insecure Deserialization (A)', labTitle: 'Lab 8: Deserialization' },
  'deserialization/basic-b':          { labId: '8', variantId: '1b', title: 'Insecure Deserialization (B)', labTitle: 'Lab 8: Deserialization' },
  'deserialization/basic-c':          { labId: '8', variantId: '1c', title: 'Insecure Deserialization (C)', labTitle: 'Lab 8: Deserialization' },
  'deserialization/advanced':         { labId: '8', variantId: '2', title: 'Advanced Deserialization', labTitle: 'Lab 8: Deserialization' }
};

/**
 * Get the lab configuration for a specific route slug.
 * @param slug The url slug, e.g. "path-traversal/docuvault"
 * @returns LabRouteConfig or undefined if not found
 */
export function getLabConfig(slug: string): LabRouteConfig | undefined {
  return LAB_ROUTES[slug];
}

/**
 * Returns all configured lab route slugs.
 * @returns Array of slugs
 */
export function getAllLabSlugs(): string[] {
  return Object.keys(LAB_ROUTES);
}
