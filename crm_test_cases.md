# Wersel CRM: Comprehensive Test Plan

This document outlines the positive and negative test cases for each module in the Wersel CRM system. It is designed to ensure robust performance, security, and data integrity across all user roles.

---

## 1. Authentication & Security
**Objective**: Verify that only authorized users can access the system and that Role-Based Access Control (RBAC) is strictly enforced.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| AUTH-01 | Successful Login | Positive | User is redirected to Dashboard with a valid JWT token stored. |
| AUTH-02 | Login with Incorrect Password | Negative | Error: "Invalid credentials" message and access denied. |
| AUTH-03 | Login with Non-existent Email | Negative | Error: "Invalid credentials" (security best practice to hide existence). |
| AUTH-04 | Access Protected Route without Token | Negative | 401 Unauthorized redirect to login page. |
| AUTH-05 | Action unauthorized for Role (e.g. Rep deleting User) | Negative | 403 Forbidden message; action is blocked in UI and API. |
| AUTH-06 | Token Expiration Handling | Negative | Session expires; user is automatically logged out and prompted to re-login. |

---

## 2. Lead Management
**Objective**: Validate the lead lifecycle from creation to conversion into Accounts and Contacts.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| LEAD-01 | Create Lead with all valid fields | Positive | Lead created successfully; unique Lead ID generated (e.g., LEAD-2025-001). |
| LEAD-02 | Create Lead with missing required email | Negative | UI validation error: "Email is required"; API returns 400 Bad Request. |
| LEAD-03 | Convert Qualified Lead | Positive | Lead status becomes "Converted"; one Account and one Contact are auto-created. |
| LEAD-04 | Attempt to convert an "Unqualified" Lead | Negative | Conversion button disabled or error message: "Lead must be qualified first." |
| LEAD-05 | Lead Status Progress (New -> Contacted -> Qualified) | Positive | Status history is updated correctly; visible in Activity Feed. |
| LEAD-06 | Duplicate Email Detection | Negative | API prevents creation of second lead with the same unique email. |

---

## 3. Account & Contact Registry
**Objective**: Ensure client data is accurately maintained and correctly linked.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| ACC-01 | Update Account Details (e.g. Website) | Positive | Changes saved and reflected immediately on the Account Details page. |
| ACC-02 | Delete Account with active Opportunities | Negative / Warning | Prompt user for confirmation; ensure soft-delete works (if implemented). |
| CON-01 | Add New Contact to an existing Account | Positive | Contact appears in the "Related Contacts" list of that Account. |
| CON-02 | Set Contact as "Primary Decision Maker" | Positive | Contact is highlighted with the DM badge in the list. |
| CON-03 | Move Contact to a different Account | Positive | Relationship updated; Contact disappears from old account list. |

---

## 4. Sales Pipeline (Opportunities)
**Objective**: Track deals through the sales funnel with accurate probability and value tracking.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| OPP-01 | Advance Opportunity Stage (Proposal -> Negotiation) | Positive | Probability % increases automatically; Stage ribbon updates visually. |
| OPP-02 | Win an Opportunity (Closed Won) | Positive | Opportunity moves to "Closed Won"; "Discovery Task" auto-generated in Activity Feed. |
| OPP-03 | Lose an Opportunity (Closed Lost) | Positive | Deal value removed from active pipeline; reason for loss captured. |
| OPP-04 | Enter Invalid Amount (Negative Value) | Negative | Error: "Amount must be a positive number." |

---

## 5. AI Projects & Model Tracking
**Objective**: Verify the specialized delivery metrics for AI solutions.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| PRJ-01 | Complete Project Phase (e.g. Data Prep) | Positive | Phase status turns green; overall project completion % increases. |
| PRJ-02 | Log New AI Model Performance Metrics | Positive | Accuracy, F1-Score, and Precision saved; visible in Model History. |
| PRJ-03 | Update Phase with Invalid Progress (>100%) | Negative | Error: "Progress cannot exceed 100%." |
| PRJ-04 | Toggle Model Active Status | Positive | Model is marked inactive; historical data preserved but not used in current stats. |

---

## 6. Activity Engine
**Objective**: Monitor all interactions linked to various CRM entities.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| ACT-01 | Log a Call from Account Details | Positive | Call activity appears at top of timeline; "Call" icon displayed. |
| ACT-02 | Schedule a Task with a Past Date | Negative / Warning | UI warns that task is "Overdue" immediately upon creation. |
| ACT-03 | View Activity Feed for specific Contact | Positive | Shows only activities linked to that contact or their parent account. |

---

## 7. Dashboard & Reporting
**Objective**: Ensure managers have accurate, real-time visibility into performance.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| RPT-01 | Dashboard Stats Refresh on Data Change | Positive | Adding a $100k Opp immediately updates the "Total Pipeline" stat. |
| RPT-02 | Idle Leads Identification | Positive | Leads with no activity for >30 days are correctly labeled as "Idle." |
| RPT-03 | Access Dashboard as Sales Rep | Positive | Stats filtered to show only "My Leads" and "My Activity." |

---

## 8. API & System Integration
**Objective**: Validate backend robustness and edge-case handling.

| Test Case ID | Scenario | Type | Expected Result |
| :--- | :--- | :--- | :--- |
| API-01 | Bulk Export Contacts (CSV/JSON) | Positive | File downloads with correct headers and data mapping. |
| API-02 | Rate Limit Triggering | Negative | Sending 100 requests in 1 second returns "429 Too Many Requests." |
| API-03 | SQL/NoSQL Injection Attempt | Negative | Sanitizer middleware strips malicious tags; 400 Bad Request if severe. |
| API-04 | Large Payload Upload | Negative | File >10MB blocked by Multer middleware with clear error. |
