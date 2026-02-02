# CRM System Workflow & Design Flows for Wersel AI

## 1. DETAILED WORKFLOW DIAGRAMS

### 1.1 Lead-to-Account Conversion Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEAD MANAGEMENT LIFECYCLE                    │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├──→ Lead Created (Source: Website, LinkedIn, Referral, etc.)
  │         │
  │         ├─ Lead Number: LEAD-2025-001
  │         ├─ Status: NEW
  │         ├─ Rating: COLD
  │         └─ Owner: Sales Rep Assigned
  │
  ├──→ Lead Contacted
  │         │
  │         ├─ Update Status: CONTACTED
  │         ├─ Last Contact Date: NOW
  │         ├─ Add Activity (Call/Email/Meeting)
  │         ├─ Set Next Follow-up
  │         └─ Update Notes
  │
  ├──→ Lead Qualification Decision
  │    │
  │    ├─→ YES - QUALIFIED
  │    │       │
  │    │       ├─ Status: QUALIFIED
  │    │       ├─ Rating: HOT
  │    │       ├─ Budget Confirmed
  │    │       ├─ Decision Timeline Identified
  │    │       └─ Next: Convert to Account
  │    │
  │    └─→ NO - UNQUALIFIED
  │            │
  │            ├─ Status: UNQUALIFIED
  │            ├─ Store Reason
  │            ├─ Update Notes
  │            └─ End / Archive
  │
  ├──→ Lead Conversion to Account
  │         │
  │         ├─ Trigger: Manual click "Convert Lead"
  │         │
  │         ├─ System Creates:
  │         │  ├─ Account (PROSPECT status)
  │         │  ├─ Account Number: ACC-2025-001
  │         │  ├─ Contact from Lead data
  │         │  ├─ Associated Contact to Account
  │         │  └─ Initial Opportunity
  │         │
  │         ├─ Event Published: LeadConvertedEvent
  │         │
  │         └─ Triggered Actions:
  │            ├─ Send welcome email to Lead
  │            ├─ Create task for Account Manager
  │            ├─ Assign Account Owner
  │            └─ Log conversion in activity timeline
  │
  └──→ PROSPECT ACCOUNT CREATED
         │
         └──→ (Move to Opportunity Management workflow)
```

### 1.2 Sales Pipeline & Opportunity Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│               OPPORTUNITY & SALES PIPELINE WORKFLOW              │
└─────────────────────────────────────────────────────────────────┘

PROSPECTING (Win Probability: 10%)
│
├─ What Happens:
│  ├─ Opportunity Created from Account
│  ├─ Name: "AI Medical Imaging Solution for Hospital X"
│  ├─ Amount: $150,000 (estimated)
│  ├─ Owner: Sales Rep
│  ├─ Expected Close Date: 3 months out
│  └─ Initial research & discovery
│
├─ Activities:
│  ├─ Initial intro call with account
│  ├─ Send company information
│  ├─ Schedule initial meeting
│  └─ Identify decision makers & influencers
│
└─→ Advance Condition: Initial Interest Confirmed

                    ▼

QUALIFICATION (Win Probability: 25%)
│
├─ What Happens:
│  ├─ Validate business need
│  ├─ Confirm budget availability
│  ├─ Identify decision-making process
│  ├─ Understand timeline
│  └─ Build relationship with stakeholders
│
├─ Activities:
│  ├─ Discovery call with technical team
│  ├─ Demo of capabilities
│  ├─ Reference call with similar client
│  ├─ Budget discussion & approval
│  └─ Document requirements
│
└─→ Advance Condition: Qualification Criteria Met
   (Budget, Timeline, Authority, Need)

                    ▼

PROPOSAL (Win Probability: 50%)
│
├─ What Happens:
│  ├─ Create detailed proposal document
│  ├─ Include:
│  │  ├─ Problem statement
│  │  ├─ Proposed solution (AI model details)
│  │  ├─ Project timeline
│  │  ├─ Team composition
│  │  ├─ Deliverables
│  │  ├─ Cost breakdown ($150K)
│  │  └─ ROI projection
│  │
│  ├─ System generates PDF proposal
│  ├─ Send to decision makers
│  └─ Schedule proposal presentation
│
├─ Activities:
│  ├─ Proposal presentation meeting
│  ├─ Q&A session with technical team
│  ├─ Address concerns
│  ├─ Follow-up emails
│  └─ Gather feedback
│
└─→ Advance Condition: Proposal Well-Received
   (Positive feedback, Interest in next step)

                    ▼

NEGOTIATION (Win Probability: 75%)
│
├─ What Happens:
│  ├─ Discuss terms & conditions
│  ├─ Negotiate pricing
│  ├─ Refine scope of work
│  ├─ Align on timeline
│  ├─ Contract review
│  └─ Address final concerns
│
├─ Activities:
│  ├─ Contract negotiations
│  ├─ Legal review of terms
│  ├─ Management approval
│  ├─ Executive signoff
│  └─ Final details confirmed
│
└─→ Advance Condition: Contract Signed
   (All parties in agreement)

                    ▼

CLOSED WON (Win Probability: 100%)  ✓
│
├─ Event Published: OpportunityWonEvent
│  ├─ Opportunity ID: opp-123
│  ├─ Account ID: acc-456
│  ├─ Deal Value: $150,000
│  ├─ Close Date: TODAY
│  └─ Project Code: PRJ-2025-001
│
├─ System Automatically Creates:
│  ├─ Project record (status: PLANNING)
│  ├─ Project phases
│  ├─ Team allocation
│  ├─ Budget tracking
│  ├─ Milestone definitions
│  └─ Invoice for first phase
│
├─ Actions Triggered:
│  ├─ Send congratulatory email
│  ├─ Create project kickoff meeting
│  ├─ Notify project manager
│  ├─ Schedule customer kickoff
│  ├─ Create implementation plan
│  ├─ Update sales forecasts
│  ├─ Mark for commission calculation
│  └─ Archive opportunity
│
└─→ Move to PROJECT MANAGEMENT Workflow

                OR

CLOSED LOST (Win Probability: 0%)  ✗
│
├─ Event Published: OpportunityLostEvent
│
├─ Record Information:
│  ├─ Reason for Loss
│  │  ├─ Competitor (which one?)
│  │  ├─ Budget/Pricing
│  │  ├─ Timeline mismatch
│  │  ├─ Internal decision change
│  │  └─ Other
│  │
│  └─ Competitor Info (if lost to competitor)
│
├─ Actions:
│  ├─ Send follow-up email
│  ├─ Document lessons learned
│  ├─ Create re-engagement plan
│  ├─ Set follow-up date (6 months)
│  └─ Archive opportunity
│
└─→ Analysis & Future Engagement Plan
```

### 1.3 Project Management & Delivery Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│           PROJECT LIFECYCLE & AI DELIVERY WORKFLOW               │
└─────────────────────────────────────────────────────────────────┘

PROJECT CREATION (From Won Opportunity)
│
├─ Auto-Generated:
│  ├─ Project Code: PRJ-2025-001
│  ├─ Project Name: "Hospital X - Lung Cancer Detection AI"
│  ├─ Status: PLANNING
│  ├─ Budget: $150,000
│  ├─ Duration: 6 months
│  ├─ Account Link: Hospital X
│  └─ Opportunity Link: OPP-2025-045
│
└─→ Project Manager Assigned

             ▼

PLANNING PHASE (Weeks 1-2)
│
├─ Activities:
│  ├─ Kickoff meeting with client
│  ├─ Finalize requirements
│  ├─ Define acceptance criteria
│  ├─ Create project timeline
│  ├─ Assign team members
│  ├─ Set up data access
│  └─ Create detailed project plan
│
├─ Deliverables:
│  ├─ Project Charter
│  ├─ Requirements Document
│  ├─ Data Sharing Agreement
│  ├─ Project Timeline
│  └─ Team Roster
│
├─ System Records:
│  ├─ Create ProjectPhase (PLANNING)
│  ├─ Create tasks & milestones
│  ├─ Set team members
│  └─ Start spending tracking
│
└─→ Approval: Client signs off

             ▼

DATA PREPARATION PHASE (Weeks 3-6)
│
├─ Activities:
│  ├─ Collect medical imaging data (CT scans)
│  ├─ Data anonymization & HIPAA compliance
│  ├─ Data preprocessing & cleaning
│  ├─ Data validation
│  ├─ Create training/validation/test splits
│  └─ Quality assurance checks
│
├─ Deliverables:
│  ├─ Cleaned dataset (10,000 images)
│  ├─ Data quality report
│  ├─ Data dictionary
│  └─ Compliance certification
│
├─ System Records:
│  ├─ Create ProjectPhase (DATA_PREP)
│  ├─ Record data statistics
│  ├─ Log preprocessing steps
│  └─ Update completion percentage (25%)
│
└─→ Data Ready for Model Training

             ▼

MODEL DEVELOPMENT PHASE (Weeks 7-14)
│
├─ AI Model Configuration Created:
│  ├─ Model Name: "Lung Cancer Detection FNN v1"
│  ├─ Type: FNN (Feedforward Neural Network)
│  ├─ Training Approach: Levenberg-Marquardt
│  ├─ Input: CT scan images (256x256 grayscale)
│  ├─ Output: Classification (Cancer / No Cancer)
│  └─ Status: IN_TRAINING
│
├─ Activities:
│  ├─ Feature engineering
│  │  ├─ DWT (Discrete Wavelet Transform)
│  │  ├─ DCT (Discrete Cosine Transform)
│  │  ├─ GLCM (Gray-Level Co-occurrence Matrix)
│  │  └─ Histogram analysis
│  │
│  ├─ Model training iterations
│  │  ├─ Build FNN architecture
│  │  ├─ Training with Levenberg-Marquardt
│  │  ├─ Hyperparameter tuning
│  │  ├─ Cross-validation (k-fold)
│  │  └─ Performance analysis
│  │
│  └─ Baseline comparison
│      ├─ Compare with U-Net
│      ├─ Compare with SVM
│      └─ Document performance metrics
│
├─ Performance Tracking:
│  ├─ Accuracy: 94.2%
│  ├─ Precision: 96.1%
│  ├─ Recall: 91.8%
│  ├─ F1-Score: 0.939
│  ├─ Sensitivity: 95%
│  ├─ Specificity: 92%
│  └─ AUC-ROC: 0.968
│
├─ System Records:
│  ├─ Create ProjectPhase (MODEL_DEV)
│  ├─ Update AIModelConfig metrics
│  ├─ Create version history
│  ├─ Log training iterations
│  └─ Update completion percentage (50%)
│
├─ Quality Gates:
│  ├─ Performance threshold met? YES
│  ├─ Clinical validation? PENDING
│  └─ Ethics review? PASSED
│
└─→ Model meets acceptance criteria

             ▼

VALIDATION & TESTING PHASE (Weeks 15-18)
│
├─ Activities:
│  ├─ Clinical validation with radiologists
│  ├─ External validation dataset testing
│  ├─ Edge case testing
│  ├─ Robustness testing
│  │  ├─ Different scanner brands
│  │  ├─ Different imaging protocols
│  │  ├─ Noisy data scenarios
│  │  └─ Low-quality images
│  │
│  ├─ Performance validation
│  │  ├─ Blind test with new data
│  │  ├─ Comparison with radiologist predictions
│  │  ├─ Inter-rater reliability
│  │  └─ Sensitivity analysis
│  │
│  └─ Documentation
│      ├─ Validation report
│      ├─ Clinical evidence
│      ├─ Safety assessment
│      └─ Risk analysis
│
├─ System Records:
│  ├─ Create ProjectPhase (VALIDATION)
│  ├─ Update AIModelConfig (status: VALIDATION)
│  ├─ Log test results
│  └─ Update completion percentage (75%)
│
└─→ All tests passed. Ready for deployment.

             ▼

DEPLOYMENT PHASE (Weeks 19-22)
│
├─ Activities:
│  ├─ API development
│  │  ├─ Build REST API wrapper
│  │  ├─ Add authentication
│  │  ├─ Implement rate limiting
│  │  └─ Add logging & monitoring
│  │
│  ├─ Infrastructure setup
│  │  ├─ Containerize with Docker
│  │  ├─ Deploy to AWS/Azure/GCP
│  │  ├─ Set up monitoring & alerts
│  │  ├─ Configure auto-scaling
│  │  └─ SSL/TLS certificates
│  │
│  ├─ Integration with hospital system
│  │  ├─ DICOM API integration
│  │  ├─ EHR system integration
│  │  ├─ Data privacy compliance
│  │  └─ End-to-end testing
│  │
│  └─ User training
│      ├─ Radiology team training
│      ├─ Admin training
│      ├─ Documentation
│      └─ Support handoff
│
├─ System Records:
│  ├─ Create ProjectPhase (DEPLOYMENT)
│  ├─ Update AIModelConfig
│  │  ├─ Status: DEPLOYED
│  │  ├─ Deployment URL: https://api.Hospital-X.ai/v1/predict
│  │  ├─ Deployment Date: 2025-04-15
│  │  ├─ GitHub Repo: https://github.com/wersel/hospital-x-ai
│  │  └─ Documentation Link
│  │
│  └─ Update completion percentage (90%)
│
└─→ Model live in production

             ▼

MONITORING & OPTIMIZATION (Ongoing - Weeks 23+)
│
├─ Activities:
│  ├─ Performance monitoring
│  │  ├─ Daily accuracy checks
│  │  ├─ Drift detection
│  │  ├─ Prediction quality monitoring
│  │  └─ User feedback collection
│  │
│  ├─ Support & maintenance
│  │  ├─ User issue resolution
│  │  ├─ Bug fixes
│  │  ├─ Performance tuning
│  │  └─ System updates
│  │
│  ├─ Model improvements
│  │  ├─ Collect new data
│  │  ├─ Retrain periodically
│  │  ├─ Test new model versions
│  │  └─ A/B testing improvements
│  │
│  └─ Ongoing optimization
│      ├─ Hospital provides feedback
│      ├─ Model improvements planned
│      ├─ Version 2 development starts
│      └─ SLA monitoring
│
├─ System Records:
│  ├─ Create ProjectPhase (MAINTENANCE)
│  ├─ Log all issues & resolutions
│  ├─ Track model versions
│  ├─ Monitor deployment metrics
│  └─ Update completion percentage (100%)
│
└─→ Ongoing support continues

             ▼

PROJECT CLOSURE (Optional - Maintenance Mode)
│
├─ When Complete:
│  ├─ All deliverables signed off
│  ├─ Client accepts model
│  ├─ SLA terms agreed upon
│  ├─ Support contract established
│  └─ Final payment processed
│
├─ System Records:
│  ├─ Project Status: COMPLETED
│  ├─ Actual End Date: 2025-04-15
│  ├─ Final Budget: $149,500
│  ├─ Final Metrics: Documented
│  ├─ Create post-project review
│  └─ Archive project documentation
│
└─→ Move to ongoing support mode
```

---

## 2. FRONTEND DESIGN FLOWS

### 2.1 Account Management UI Flow

```
┌──────────────────────────────────────┐
│     ACCOUNTS LIST PAGE                │
├──────────────────────────────────────┤
│                                      │
│  [New Account]  [Search] [Filter]    │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ Company Name │ Type │ Owner │    │
│  ├──────────────────────────────┤   │
│  │ Hospital X   │PROSPECT│John  │   │
│  │ Tech Corp    │CUSTOMER│Sarah │   │
│  │ MediCare Inc │PROSPECT│Mike  │   │
│  └──────────────────────────────┘   │
│  [Prev] Page 1/3 [Next]              │
│                                      │
└──────────────────────────────────────┘
           │ Click Account
           ▼
┌──────────────────────────────────────┐
│     ACCOUNT DETAIL PAGE              │
├──────────────────────────────────────┤
│ Hospital X                            │
│ ├─ Account ID: ACC-2025-001           │
│ ├─ Type: PROSPECT                     │
│ ├─ Industry: HEALTHCARE               │
│ ├─ Website: www.hospital-x.com        │
│ ├─ Phone: +1-555-1234                 │
│ ├─ Status: ACTIVE                     │
│ ├─ Annual Revenue: $500M              │
│ ├─ Owner: John Smith                  │
│ ├─ Next Follow-up: 2025-02-15        │
│ │                                     │
│ ├─ Contacts (2)                       │
│ │  ├─ Dr. James Wilson (CEO)          │
│ │  └─ Sarah Johnson (CTO)             │
│ │                                     │
│ ├─ Opportunities (1)                  │
│ │  └─ Lung Cancer Detection AI        │
│ │     (PROPOSAL stage, $150K)         │
│ │                                     │
│ ├─ Projects (0)                       │
│ │                                     │
│ └─ Activities (Timeline)              │
│    ├─ Call: 2025-02-10 with CEO      │
│    ├─ Email: 2025-02-08 proposal     │
│    └─ Meeting: 2025-02-05 discovery  │
│                                      │
│ [Edit] [Convert Lead] [Delete]       │
└──────────────────────────────────────┘
```

### 2.2 Sales Pipeline (Kanban) UI Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    SALES PIPELINE DASHBOARD                      │
│                    [View: Kanban] [View: Table]                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ PROSPECTING │ │ QUALIFICATION│ │ PROPOSAL    │ │ NEGOTIATION │ │
│ │  (10%)      │ │   (25%)      │ │   (50%)     │ │   (75%)     │ │
│ │ $250K       │ │  $480K       │ │  $600K      │ │  $320K      │ │
│ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ │
│ │             │ │             │ │             │ │             │ │
│ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │
│ │ │AI Proj1 │ │ │ │AI Proj3 │ │ │ │AI Proj5 │ │ │ │AI Proj7 │ │ │
│ │ │$100K    │ │ │ │$180K    │ │ │ │$200K    │ │ │ │$160K    │ │ │
│ │ │Tech Co. │ │ │ │Hospital │ │ │ │Retail   │ │ │ │Finance  │ │ │
│ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │
│ │             │ │             │ │             │ │             │ │
│ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │
│ │ │AI Proj2 │ │ │ │AI Proj4 │ │ │ │AI Proj6 │ │ │ └─────────┘ │ │
│ │ │$150K    │ │ │ │$300K    │ │ │ │$400K    │ │ │             │ │
│ │ │Logistics│ │ │ │Insurance│ │ │ │Energy   │ │ │             │ │
│ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │             │ │
│ │             │ │             │ │             │ │             │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                  │
│ ┌─────────────────┐              ┌─────────────────┐            │
│ │ CLOSED WON      │              │ CLOSED LOST     │            │
│ │ (100%) $800K    │              │ (0%) $200K      │            │
│ ├─────────────────┤              ├─────────────────┤            │
│ │ ✓ AI Proj8      │              │ ✗ AI Proj9      │            │
│ │   $200K         │              │   $150K         │            │
│ │ ✓ AI Proj10     │              │ ✗ AI Proj11     │            │
│ │   $300K         │              │   $50K          │            │
│ │ ✓ AI Proj12     │              │                 │            │
│ │   $300K         │              │                 │            │
│ └─────────────────┘              └─────────────────┘            │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ PIPELINE SUMMARY:                                           │ │
│ │ Total Open Opportunities: $2.65M                            │ │
│ │ Average Deal Size: $150K                                    │ │
│ │ Weighted Forecast: $1.15M                                   │ │
│ │ Win Rate: 87.5%                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

User Actions:
- Drag opportunity card between stages
- Click card to view details
- Add activity from card
- Quick edit probability
```

### 2.3 Project Tracking UI Flow

```
┌──────────────────────────────────────┐
│     PROJECTS LIST PAGE                │
├──────────────────────────────────────┤
│                                      │
│  [New Project] [Filter] [Search]     │
│                                      │
│  ┌──────────────────────────────┐   │
│  │Name     │Status │Completion │    │
│  ├──────────────────────────────┤   │
│  │Lung Ca  │ACTIVE │████░░░░░░ 40% │
│  │Retail   │ACTIVE │██████░░░░ 60% │
│  │Finance  │ACTIVE │████░░░░░░ 40% │
│  │Energy   │COMPL  │██████████ 100%│
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
           │ Click Project
           ▼
┌──────────────────────────────────────┐
│     PROJECT DETAIL PAGE              │
├──────────────────────────────────────┤
│ Lung Cancer Detection AI             │
│ ├─ Project Code: PRJ-2025-001        │
│ ├─ Account: Hospital X               │
│ ├─ Status: IN_PROGRESS               │
│ ├─ Type: CUSTOM_AI_DEVELOPMENT       │
│ │                                    │
│ ├─ Timeline                          │
│ │  Start: 2025-01-15                │
│ │  End: 2025-07-15                  │
│ │  Duration: 6 months                │
│ │                                    │
│ ├─ Budget Tracking                   │
│ │  Budget: $150,000                 │
│ │  Spent: $60,000 (40%)             │
│ │  Remaining: $90,000               │
│ │  Status: ON TRACK                 │
│ │                                    │
│ ├─ Team Members (4)                  │
│ │  └─ Dr. Arun Kumar (Lead)         │
│ │  └─ Priya Sharma (Data Scientist)  │
│ │  └─ Marco Chen (Backend Dev)       │
│ │  └─ Lisa Patel (QA)               │
│ │                                    │
│ ├─ AI Models                         │
│ │  └─ Lung Cancer Detection FNN      │
│ │     ├─ Status: IN_TRAINING        │
│ │     ├─ Accuracy: 94.2%            │
│ │     ├─ Type: FNN                  │
│ │     ├─ Training: Levenberg-M.     │
│ │     └─ Inputs: CT scans           │
│ │                                    │
│ ├─ Project Phases                    │
│ │  ├─ PLANNING      (Completed)     │
│ │  ├─ DATA_PREP     (Completed)     │
│ │  ├─ MODEL_DEV     (In Progress) ◄─── CURRENT
│ │  ├─ VALIDATION    (Pending)       │
│ │  ├─ DEPLOYMENT    (Pending)       │
│ │  └─ MAINTENANCE   (Future)        │
│ │                                    │
│ ├─ Milestones                        │
│ │  ├─ ✓ Data collected (Jan 30)    │
│ │  ├─ ✓ Data cleaned (Feb 5)       │
│ │  ├─ ○ Model trained (Mar 1)      │
│ │  ├─ ○ Validated (Mar 20)         │
│ │  ├─ ○ Deployed (Apr 15)          │
│ │  └─ ○ Support handoff (May 1)    │
│ │                                    │
│ └─ [Edit] [Archive] [Complete]      │
│                                      │
└──────────────────────────────────────┘
```

---

## 3. DATABASE SCHEMA RELATIONSHIPS

### 3.1 Entity Relationship Diagram (ERD)

```
┌──────────────┐
│   USERS      │
├──────────────┤
│ id (PK)      │
│ email        │
│ password     │
│ role         │
│ status       │
└──────────────┘
    ▲   ▲   ▲
    │   │   │
    │   │   └─── owns ──────┐
    │   │                   │
    │   └─── manages ───────┼───────┐
    │                       │       │
    │                       ▼       │
    │                  ┌──────────────┐
    │                  │  ACCOUNTS    │
    │                  ├──────────────┤
    │                  │ id (PK)      │
    │                  │ account_no   │
    │                  │ company_name │
    │                  │ status       │
    │                  │ owner_id(FK) │
    │                  └──────────────┘
    │                       │
    ├───────────────────────┼────────────────┐
    │                       │                │
    │                       ▼                ▼
    │                 ┌──────────────┐ ┌──────────────┐
    │                 │  LEADS       │ │  CONTACTS    │
    │                 ├──────────────┤ ├──────────────┤
    │                 │ id (PK)      │ │ id (PK)      │
    │                 │ lead_no      │ │ first_name   │
    │                 │ email        │ │ last_name    │
    │                 │ status       │ │ email        │
    │                 │ owner_id(FK) │ │ account_id   │
    │                 │ rating       │ │              │
    │                 └──────────────┘ └──────────────┘
    │                       │                   ▲
    │                       │                   │
    │                       │ converts_to      │
    │                       └───────────────────┤
    │                                          │
    │                    ┌─ has many ─────────┘
    │                    │
    │                    ▼
    │              ┌──────────────────┐
    │              │ OPPORTUNITIES    │
    │              ├──────────────────┤
    │              │ id (PK)          │
    │              │ opp_no           │
    │              │ name             │
    │              │ account_id (FK)  │
    │              │ contact_id (FK)  │
    │              │ stage            │
    │              │ amount           │
    │              │ probability      │
    │              │ owner_id (FK)    │
    │              └──────────────────┘
    │                      │
    │                      │ creates
    │                      ▼
    │              ┌──────────────────┐
    │              │  PROJECTS        │
    │              ├──────────────────┤
    │              │ id (PK)          │
    │              │ project_code     │
    │              │ project_name     │
    │              │ account_id (FK)  │
    │              │ opp_id (FK)      │
    │              │ status           │
    │              │ budget           │
    │              │ spent            │
    │              │ pm_id (FK)       │
    │              └──────────────────┘
    │                      │
    │                      │ has many
    │                      │
    │                      ├─────────┬─────────┬──────────────┐
    │                      ▼         ▼         ▼              ▼
    │             ┌──────────────┐┌────────┐┌─────────┐ ┌──────────────┐
    │             │   PHASES     ││TEAM    ││DELIVER  │ │ AI_MODEL_CFG │
    │             ├──────────────┤├────────┤├─────────┤ ├──────────────┤
    │             │ id           ││user_id ││id (PK)  │ │ id (PK)      │
    │             │ project_id   ││proj_id ││desc     │ │ model_name   │
    │             │ phase_type   ││status  ││status   │ │ model_type   │
    │             │ status       ││        ││date     │ │ accuracy     │
    │             └──────────────┘└────────┘└─────────┘ │ precision    │
    │                                                    │ recall       │
    │                                                    │ f1_score     │
    │                                                    └──────────────┘
    │
    └─── creates ──→ ┌──────────────────┐
                    │  ACTIVITIES      │
                    ├──────────────────┤
                    │ id (PK)          │
                    │ type (Call/Email)│
                    │ description      │
                    │ date             │
                    │ user_id (FK)     │
                    │ account_id (FK)  │
                    │ opp_id (FK)      │
                    └──────────────────┘
```

---

## 4. API CALL FLOWS (Frontend → Backend)

### 4.1 Create Opportunity Flow

```
FRONTEND                          BACKEND
┌──────────────────┐             ┌──────────────────┐
│ Opportunity      │             │ Spring Boot API  │
│ Form Submission  │             │                  │
└──────────────────┘             └──────────────────┘
        │                                │
        │ POST /api/v1/opportunities    │
        ├────────────────────────────→ │
        │ {                            │
        │   "name": "AI Project 1"     │
        │   "accountId": "acc-123"     │
        │   "amount": 150000           │
        │   "expectedCloseDate": ...   │
        │ }                            │
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ Controller       │
        │                       │ validateInput()  │
        │                       └──────────────────┘
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ Application      │
        │                       │ Service          │
        │                       │ createOpportun.()│
        │                       └──────────────────┘
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ Domain Model     │
        │                       │ Create Aggregate │
        │                       │ Publish Events   │
        │                       └──────────────────┘
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ Repository       │
        │                       │ Save to DB       │
        │                       └──────────────────┘
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ PostgreSQL       │
        │                       │ Persist Record   │
        │                       └──────────────────┘
        │                              │
        │ 201 Created                   │
        │ {                             │
        │   "id": "opp-456"            │
        │   "opportunityNumber": "...  │
        │   "status": "PROSPECTING"    │
        │ }                            │
        │ ←────────────────────────────┤
        │                              │
        ▼                              │
    Update UI                         │
    Show Success Message              │
    Redirect to Detail Page           │
```

### 4.2 Advance Opportunity Stage Flow

```
FRONTEND                          BACKEND
User Drags Card                   
to New Column                     
(Kanban View)                     
        │                                │
        │ PUT /api/v1/opportunities/{id}/advance-stage
        ├────────────────────────────→ │
        │ {                            │
        │   "newStage": "PROPOSAL"     │
        │ }                            │
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ Validation       │
        │                       │ - Stage exist?   │
        │                       │ - Valid trans?   │
        │                       └──────────────────┘
        │                              │
        │                              ▼
        │                       ┌──────────────────┐
        │                       │ Domain Event     │
        │                       │ OpportunityChanged
        │                       └──────────────────┘
        │                              │
        │                              ├─→ Event Handler 1
        │                              │   Update Forecasts
        │                              │
        │                              ├─→ Event Handler 2
        │                              │   Send Notification
        │                              │
        │                              └─→ Event Handler 3
        │                                  Update Analytics
        │
        │ 200 OK                        │
        │ {                             │
        │   "stage": "PROPOSAL"         │
        │   "probability": 0.50         │
        │ }                             │
        │ ←────────────────────────────┤
        │                              │
        ▼                              │
    Update Card Position           │
    Update Probability Display     │
    Show Success Toast             │
```

---

## 5. SUMMARY OF KEY WORKFLOWS

| Workflow | Duration | Key Actors | Success Metric |
|----------|----------|-----------|-----------------|
| Lead to Account Conversion | 1-2 weeks | Sales Rep, Lead | Account created, linked contact |
| Opportunity Progression | 6-12 weeks | Sales Rep, Manager | Deal won or lost |
| Project Delivery | 3-6 months | PM, Dev Team, Client | Project completed, model deployed |
| Model Training & Validation | 4-8 weeks | ML Engineers, Data Scientists | Model accuracy >90% |
| Proposal Generation | 1-2 weeks | Sales Rep, Engineer | PDF sent to client |

---

## 6. SYSTEM STATES & TRANSITIONS

### Account States
```
NEW → PROSPECT → CUSTOMER → INACTIVE
              ↘    ↗
                SUSPENDED
```

### Lead States
```
NEW → CONTACTED → QUALIFIED → CONVERTED → (Account Created)
           ↘              ↗
             UNQUALIFIED
                 ↘
                  LOST
```

### Opportunity States
```
PROSPECTING → QUALIFICATION → PROPOSAL → NEGOTIATION → CLOSED_WON
    (10%)         (25%)           (50%)        (75%)         (100%)
                                                          ↓
                                                    (Create Project)
                                                    
Any Stage ──────────────────→ CLOSED_LOST (0%)
```

### Project States
```
PLANNING → DATA_PREP → MODEL_DEV → VALIDATION → DEPLOYMENT → MAINTENANCE
   ↓           ↓           ↓          ↓            ↓            ↓
 0-10%      10-25%      25-60%     60-85%      85-100%       100%
```

This comprehensive workflow document covers all the major business processes, UI flows, and data interactions needed for your production-grade CRM system!
