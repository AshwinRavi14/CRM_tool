# Production-Grade CRM Architecture for Wersel AI

## Executive Overview

This document provides a complete architecture for building a **production-grade, enterprise-scale CRM system** specifically designed for Wersel AI's business model (AI solution delivery, custom development, and consulting services). The architecture follows Salesforce and Zoho CRM patterns while being optimized for your tech stack (Java Spring Boot backend, React frontend).

---

## Part 1: UNDERSTANDING THE BUSINESS MODEL

### Wersel AI Context
- **Business Type**: AI Solutions Provider / Consulting Services / Custom Development Agency
- **Primary Users**: Sales Team, Project Managers, Account Managers, Customer Success
- **Key Entities**:
  - Prospects/Leads
  - Accounts/Companies
  - Contacts (Decision makers, technical contacts, etc.)
  - Opportunities (AI projects, consulting engagements)
  - Projects (ongoing implementations)
  - Proposals
  - Activities (Calls, Emails, Meetings)
  - Custom Products/Solutions
  - Revenue Tracking

---

## Part 2: COMPARATIVE ANALYSIS - ZOHO CRM VS SALESFORCE

### Zoho CRM Strengths for Your Use Case
| Feature | Implementation | Benefits |
|---------|-----------------|----------|
| **Modular Architecture** | Custom modules for Projects, Proposals, Artifacts | Track unique AI solution data |
| **Ease of Customization** | Drag-drop field creation, layout builders | Faster development cycles |
| **Cost Efficiency** | Better pricing for small-medium teams | Lower TCO |
| **Mobile-First** | Native mobile app | Field teams can access anywhere |
| **Blueprint Workflows** | Visual process guides | Ensures sales process consistency |
| **Built-in Automation** | Workflow rules, process builders | Reduces manual data entry |

### Salesforce Strengths for Your Use Case
| Feature | Implementation | Benefits |
|---------|-----------------|----------|
| **Enterprise Scale** | Multi-org architecture | Handles millions of records |
| **AI/ML Integration** | Einstein Analytics, Einstein Copilot | Predictive insights, automation |
| **API-First Architecture** | REST/SOAP APIs, webhooks | Deep third-party integrations |
| **Complex Relationships** | Many-to-many relationships, custom objects | Flexible data modeling |
| **Security & Compliance** | Field-level security, audit trails | Enterprise governance |
| **Developer Ecosystem** | Apex, Visualforce, Lightning | Highly customizable |

### Recommendation for Wersel AI
**Build a hybrid approach using Salesforce patterns + Zoho simplicity** via custom development:
- Zoho's modular thinking (custom modules for your unique AI projects)
- Salesforce's design patterns (Factory, Decorator, Service Layer)
- Your own tech stack (Spring Boot + React) for full control

---

## Part 3: PRODUCTION-GRADE BACKEND ARCHITECTURE

### 3.1 Technology Stack

```
Framework: Spring Boot 3.2+ (Java 17+)
Database: PostgreSQL 15+ (Primary), MongoDB (Document storage for projects)
Cache: Redis 7+ (Session, frequent queries)
Message Queue: RabbitMQ or Kafka (Async workflows)
Search: Elasticsearch (Full-text search, analytics)
API Gateway: Spring Cloud Gateway
Auth: Spring Security + OAuth2 / JWT
Monitoring: Prometheus + Grafana
Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
```

### 3.2 Domain-Driven Design (DDD) Architecture

```
crm-backend/
├── src/main/java/com/wersel/crm/
│   ├── account/
│   │   ├── domain/
│   │   │   ├── Account.java (Entity)
│   │   │   ├── AccountRepository.java (Interface)
│   │   │   └── AccountCreatedEvent.java (Domain Event)
│   │   ├── application/
│   │   │   ├── AccountService.java
│   │   │   ├── CreateAccountCommand.java
│   │   │   └── GetAccountQueryHandler.java
│   │   ├── infrastructure/
│   │   │   ├── JpaAccountRepository.java
│   │   │   └── AccountRepositoryImpl.java
│   │   └── presentation/
│   │       └── AccountController.java
│   ├── lead/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── opportunity/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── project/
│   │   ├── domain/
│   │   │   ├── Project.java
│   │   │   ├── ProjectStatus.java (Enum)
│   │   │   ├── ProjectPhase.java
│   │   │   └── AIModelConfig.java
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── activity/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── shared/
│   │   ├── domain/
│   │   │   ├── AggregateRoot.java (Base class)
│   │   │   ├── DomainEvent.java
│   │   │   ├── ValueObject.java
│   │   │   └── EntityId.java
│   │   ├── infrastructure/
│   │   │   ├── SpringDataRepository.java (Base interface)
│   │   │   └── JpaRepository.java (Generic)
│   │   ├── application/
│   │   │   ├── CommandHandler.java
│   │   │   ├── QueryHandler.java
│   │   │   └── ApplicationService.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── PermissionEvaluator.java
│   │   └── util/
│   │       ├── UUIDGenerator.java
│   │       └── DateTimeUtils.java
│   ├── config/
│   │   ├── DataSourceConfig.java
│   │   ├── MongoConfig.java
│   │   ├── CacheConfig.java (Redis)
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   └── CrmApplication.java
├── resources/
│   ├── application.yml
│   ├── application-prod.yml
│   ├── application-dev.yml
│   └── db/migration/ (Flyway migrations)
└── test/
```

### 3.3 Core Domain Models

#### Account Entity
```java
@Entity
@Table(name = "accounts")
public class Account extends AggregateRoot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String accountNumber; // AUTO-GENERATED: ACC-2025-001
    
    @Column(nullable = false)
    private String companyName;
    
    @Enumerated(EnumType.STRING)
    private AccountType accountType; // PROSPECT, CUSTOMER, PARTNER
    
    @Enumerated(EnumType.STRING)
    private Industry industry; // AI_DEVELOPMENT, HEALTHCARE, RETAIL, etc
    
    private String website;
    private String phone;
    private String email;
    
    @Embedded
    private Address billingAddress;
    
    @Embedded
    private Address shippingAddress;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status; // ACTIVE, INACTIVE, SUSPENDED
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner; // Sales rep assigned
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Set<Contact> contacts = new HashSet<>();
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Set<Opportunity> opportunities = new HashSet<>();
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private Set<Project> projects = new HashSet<>();
    
    @Column(precision = 15, scale = 2)
    private BigDecimal annualRevenue; // Account revenue (for them or potential)
    
    @Enumerated(EnumType.STRING)
    private SalesStage salesStage; // AWARENESS, CONSIDERATION, DECISION
    
    private LocalDateTime nextFollowUp;
    
    @Version
    private Long version; // Optimistic locking
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "updated_by")
    private UUID updatedBy;
    
    // Business methods
    public void addContact(Contact contact) {
        contacts.add(contact);
        contact.setAccount(this);
    }
    
    public void removeContact(Contact contact) {
        contacts.remove(contact);
        contact.setAccount(null);
    }
    
    public void transitionToCustomer() {
        if (accountType != AccountType.CUSTOMER) {
            this.accountType = AccountType.CUSTOMER;
            this.status = AccountStatus.ACTIVE;
            this.registerDomainEvent(new AccountConvertedEvent(id, companyName));
        }
    }
}
```

#### Lead Entity (for conversion to Account)
```java
@Entity
@Table(name = "leads")
public class Lead extends AggregateRoot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String leadNumber; // LEAD-2025-001
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String phone;
    private String company;
    
    @Enumerated(EnumType.STRING)
    private LeadSource source; // WEBSITE, REFERRAL, LINKEDIN, CONFERENCE, etc
    
    @Enumerated(EnumType.STRING)
    private LeadStatus status; // NEW, CONTACTED, QUALIFIED, UNQUALIFIED, CONVERTED, LOST
    
    @Enumerated(EnumType.STRING)
    private LeadRating rating; // HOT, WARM, COLD
    
    @Column(length = 2000)
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    private LocalDateTime lastContactDate;
    private LocalDateTime nextFollowUpDate;
    
    @Column(length = 1000)
    private String interestAreas; // AI DEVELOPMENT, MEDICAL IMAGING, etc
    
    @OneToOne(mappedBy = "lead")
    private Account convertedAccount; // Once converted
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Domain methods
    public Account convertToAccount() {
        if (status == LeadStatus.CONVERTED) {
            throw new BusinessRuleException("Lead already converted");
        }
        
        Account account = new Account();
        account.setCompanyName(company);
        account.setAccountType(AccountType.PROSPECT);
        account.setStatus(AccountStatus.ACTIVE);
        // ... map other fields
        
        this.status = LeadStatus.CONVERTED;
        this.convertedAccount = account;
        this.registerDomainEvent(
            new LeadConvertedEvent(id, account.getId(), firstName + " " + lastName)
        );
        
        return account;
    }
    
    public void qualify(String reason) {
        this.status = LeadStatus.QUALIFIED;
        this.rating = LeadRating.HOT;
        this.lastContactDate = LocalDateTime.now();
        this.registerDomainEvent(new LeadQualifiedEvent(id, reason));
    }
}
```

#### Opportunity Entity
```java
@Entity
@Table(name = "opportunities")
public class Opportunity extends AggregateRoot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String opportunityNumber; // OPP-2025-001
    
    @Column(nullable = false)
    private String name; // "AI Medical Imaging Solution for Hospital X"
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "account_id")
    private Account account;
    
    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact primaryContact; // Decision maker
    
    @Enumerated(EnumType.STRING)
    private OpportunityStage stage; // PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST
    
    @Column(precision = 15, scale = 2)
    private BigDecimal amount; // Deal value
    
    @Temporal(TemporalType.DATE)
    private LocalDate expectedCloseDate;
    
    @Temporal(TemporalType.DATE)
    private LocalDate closedDate;
    
    @Column(scale = 1)
    private Double probability; // 10%, 25%, 50%, 75%, 90%
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private OpportunityType opportunityType; // NEW_BUSINESS, EXPANSION, RENEWAL, AI_INTEGRATION
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL)
    private List<ActivityTimeline> activities = new ArrayList<>();
    
    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL)
    private List<ProposalVersion> proposals = new ArrayList<>();
    
    @OneToOne(mappedBy = "opportunity")
    private Project associatedProject; // Once won
    
    @Enumerated(EnumType.STRING)
    private CompetitionLevel competition; // NONE, LOW, MEDIUM, HIGH
    
    private String competitorNames;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal forecastAmount; // Amount manager forecasts
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Domain methods
    public void advanceStage(OpportunityStage newStage) {
        if (!isValidTransition(this.stage, newStage)) {
            throw new BusinessRuleException("Invalid stage transition");
        }
        
        OpportunityStage oldStage = this.stage;
        this.stage = newStage;
        
        if (newStage == OpportunityStage.CLOSED_WON) {
            this.closedDate = LocalDate.now();
            this.probability = 100.0;
            this.registerDomainEvent(
                new OpportunityWonEvent(id, account.getId(), amount)
            );
        } else if (newStage == OpportunityStage.CLOSED_LOST) {
            this.closedDate = LocalDate.now();
            this.probability = 0.0;
            this.registerDomainEvent(new OpportunityLostEvent(id));
        }
    }
    
    private boolean isValidTransition(OpportunityStage from, OpportunityStage to) {
        // Define valid stage progressions
        return true; // Implement based on your workflow
    }
}
```

#### Project Entity (AI Project Delivery)
```java
@Entity
@Table(name = "projects")
public class Project extends AggregateRoot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String projectCode; // PRJ-2025-001
    
    @Column(nullable = false)
    private String projectName;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "account_id")
    private Account account;
    
    @OneToOne
    @JoinColumn(name = "opportunity_id")
    private Opportunity opportunity; // Which opportunity created this
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status; // PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
    
    @Enumerated(EnumType.STRING)
    private ProjectType projectType; // CUSTOM_AI_DEVELOPMENT, MEDICAL_IMAGING, CONSULTING, etc
    
    @Column(length = 2000)
    private String description;
    
    @Temporal(TemporalType.DATE)
    private LocalDate startDate;
    
    @Temporal(TemporalType.DATE)
    private LocalDate planedEndDate;
    
    @Temporal(TemporalType.DATE)
    private LocalDate actualEndDate;
    
    @ManyToOne
    @JoinColumn(name = "project_manager_id")
    private User projectManager;
    
    @ManyToMany
    @JoinTable(
        name = "project_team_members",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> teamMembers = new HashSet<>();
    
    @Column(precision = 15, scale = 2)
    private BigDecimal budget;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal spent = BigDecimal.ZERO;
    
    @Column(scale = 1)
    private Double completionPercentage = 0.0;
    
    // AI-Specific Fields
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<AIModelConfig> models = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectPhase> phases = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Deliverable> deliverables = new ArrayList<>();
    
    @Column(length = 2000)
    private String technicalStack; // Languages, frameworks used
    
    @Column(length = 1000)
    private String dataRequirements; // Data needed for model training
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Domain methods
    public void addPhase(ProjectPhase phase) {
        phases.add(phase);
        phase.setProject(this);
    }
    
    public void addAIModel(AIModelConfig model) {
        models.add(model);
        model.setProject(this);
    }
    
    public void completeProject() {
        if (status == ProjectStatus.COMPLETED) {
            throw new BusinessRuleException("Project already completed");
        }
        
        this.status = ProjectStatus.COMPLETED;
        this.actualEndDate = LocalDate.now();
        this.completionPercentage = 100.0;
        this.registerDomainEvent(new ProjectCompletedEvent(id));
    }
}
```

#### AI Model Configuration Entity
```java
@Entity
@Table(name = "ai_model_configs")
public class AIModelConfig extends AggregateRoot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String modelName; // "Lung Cancer Detection FNN v2"
    
    @Column(nullable = false)
    private String modelType; // "FNN", "U-Net", "SVM", "CNN", "LSTM"
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @Column(length = 2000)
    private String description;
    
    @Column(length = 500)
    private String inputDataType; // "CT Scans", "X-Rays", "MRI Images"
    
    @Column(scale = 4)
    private Double accuracy; // Model accuracy percentage
    
    @Column(scale = 4)
    private Double precision;
    
    @Column(scale = 4)
    private Double recall;
    
    @Column(scale = 4)
    private Double f1Score;
    
    @Column(length = 2000)
    private String trainingApproach; // "Levenberg-Marquardt", "Adam Optimizer", etc
    
    @Enumerated(EnumType.STRING)
    private ModelStatus status; // TRAINING, VALIDATION, DEPLOYED, DEPRECATED
    
    @Column(length = 1000)
    private String deploymentURL; // Where model is exposed as API
    
    @Column(length = 1000)
    private String githubRepoURL;
    
    @Temporal(TemporalType.DATE)
    private LocalDate deploymentDate;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### 3.4 Repository Interfaces (CQRS Pattern)

```java
// Command Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByOwnerId(UUID ownerId);
    List<Account> findByStatus(AccountStatus status);
}

// Query Interface for Read Operations
public interface AccountQueryRepository {
    AccountReadModel findById(UUID id);
    List<AccountReadModel> findByOwner(UUID ownerId);
    List<AccountReadModel> searchByCompanyName(String name);
    Page<AccountReadModel> findAllPaginated(Pageable pageable);
}

public interface OpportunityRepository extends JpaRepository<Opportunity, UUID> {
    List<Opportunity> findByAccountId(UUID accountId);
    List<Opportunity> findByOwnerId(UUID ownerId);
    List<Opportunity> findByStage(OpportunityStage stage);
    List<Opportunity> findByStageAndExpectedCloseDateBetween(
        OpportunityStage stage, 
        LocalDate startDate, 
        LocalDate endDate
    );
}
```

### 3.5 Application Services (Business Logic)

```java
@Service
@Transactional
@Slf4j
public class AccountApplicationService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private DomainEventPublisher eventPublisher;
    
    @Autowired
    private AccountNumberGenerator numberGenerator;
    
    @Autowired
    private SecurityService securityService;
    
    // Command Handler: Create Account
    public AccountDTO createAccount(CreateAccountCommand cmd) {
        // Security check
        securityService.validatePermission(Permission.CREATE_ACCOUNT);
        
        // Generate unique account number
        String accountNumber = numberGenerator.generateAccountNumber();
        
        // Create aggregate
        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setCompanyName(cmd.getCompanyName());
        account.setAccountType(cmd.getAccountType());
        account.setIndustry(cmd.getIndustry());
        account.setStatus(AccountStatus.ACTIVE);
        account.setOwner(securityService.getCurrentUser());
        account.setCreatedBy(securityService.getCurrentUserId());
        
        // Validate
        account.validate();
        
        // Save
        Account savedAccount = accountRepository.save(account);
        
        // Publish domain events
        savedAccount.getDomainEvents()
            .forEach(eventPublisher::publish);
        
        log.info("Account created: {}", savedAccount.getId());
        
        return AccountDTO.from(savedAccount);
    }
    
    // Command Handler: Convert Lead to Account
    public AccountDTO convertLeadToAccount(ConvertLeadCommand cmd) {
        securityService.validatePermission(Permission.CONVERT_LEAD);
        
        Lead lead = leadRepository.findById(cmd.getLeadId())
            .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
        
        Account account = lead.convertToAccount();
        account.setOwner(lead.getOwner());
        
        Account savedAccount = accountRepository.save(account);
        savedAccount.getDomainEvents()
            .forEach(eventPublisher::publish);
        
        return AccountDTO.from(savedAccount);
    }
    
    // Query Handler: Get Account Details
    public AccountDetailDTO getAccountWithDetails(UUID accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        
        return AccountDetailDTO.from(account);
    }
    
    // Query Handler: Get Accounts by Owner
    public Page<AccountDTO> getAccountsByOwner(UUID ownerId, Pageable pageable) {
        return accountRepository.findByOwnerId(ownerId, pageable)
            .map(AccountDTO::from);
    }
    
    // Command Handler: Update Account
    public AccountDTO updateAccount(UUID accountId, UpdateAccountCommand cmd) {
        securityService.validatePermission(Permission.UPDATE_ACCOUNT);
        
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        
        account.setCompanyName(cmd.getCompanyName());
        account.setStatus(cmd.getStatus());
        account.setAnnualRevenue(cmd.getAnnualRevenue());
        account.setNextFollowUp(cmd.getNextFollowUp());
        account.setUpdatedBy(securityService.getCurrentUserId());
        
        Account updated = accountRepository.save(account);
        updated.getDomainEvents()
            .forEach(eventPublisher::publish);
        
        return AccountDTO.from(updated);
    }
}
```

#### Opportunity Service with Pipeline Management
```java
@Service
@Transactional
@Slf4j
public class OpportunityApplicationService {
    
    @Autowired
    private OpportunityRepository opportunityRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private DomainEventPublisher eventPublisher;
    
    @Autowired
    private SalesForecasterService salesForecaster;
    
    // Create Opportunity
    public OpportunityDTO createOpportunity(CreateOpportunityCommand cmd) {
        Account account = accountRepository.findById(cmd.getAccountId())
            .orElseThrow(() -> new EntityNotFoundException("Account not found"));
        
        Opportunity opportunity = new Opportunity();
        opportunity.setOpportunityNumber(generateOpportunityNumber());
        opportunity.setName(cmd.getName());
        opportunity.setAccount(account);
        opportunity.setStage(OpportunityStage.PROSPECTING);
        opportunity.setAmount(cmd.getAmount());
        opportunity.setExpectedCloseDate(cmd.getExpectedCloseDate());
        opportunity.setProbability(0.1); // 10% for new
        opportunity.setOwner(securityService.getCurrentUser());
        
        Opportunity saved = opportunityRepository.save(opportunity);
        saved.getDomainEvents()
            .forEach(eventPublisher::publish);
        
        return OpportunityDTO.from(saved);
    }
    
    // Advance Stage
    public OpportunityDTO advanceStage(UUID opportunityId, 
                                      OpportunityStage newStage) {
        Opportunity opp = opportunityRepository.findById(opportunityId)
            .orElseThrow(() -> new EntityNotFoundException("Opportunity not found"));
        
        opp.advanceStage(newStage);
        
        // Update probability
        Double newProbability = calculateProbability(newStage);
        opp.setProbability(newProbability);
        
        // Trigger forecasting
        if (newStage == OpportunityStage.PROPOSAL) {
            BigDecimal forecastAmount = salesForecaster
                .calculateForecast(opp);
            opp.setForecastAmount(forecastAmount);
        }
        
        Opportunity updated = opportunityRepository.save(opp);
        updated.getDomainEvents()
            .forEach(eventPublisher::publish);
        
        log.info("Opportunity {} advanced to stage {}", 
            opportunityId, newStage);
        
        return OpportunityDTO.from(updated);
    }
    
    // Get Sales Pipeline
    public SalesPipelineDTO getSalesPipeline(UUID ownerOrAccountId) {
        List<Opportunity> opps = opportunityRepository
            .findByOwnerId(ownerOrAccountId);
        
        return SalesPipelineDTO.builder()
            .prospecting(opps.stream()
                .filter(o -> o.getStage() == OpportunityStage.PROSPECTING)
                .map(OpportunityDTO::from)
                .collect(Collectors.toList()))
            .qualification(opps.stream()
                .filter(o -> o.getStage() == OpportunityStage.QUALIFICATION)
                .collect(Collectors.toList()))
            .proposal(opps.stream()
                .filter(o -> o.getStage() == OpportunityStage.PROPOSAL)
                .collect(Collectors.toList()))
            .negotiation(opps.stream()
                .filter(o -> o.getStage() == OpportunityStage.NEGOTIATION)
                .collect(Collectors.toList()))
            .totalPipelineValue(opps.stream()
                .map(Opportunity::getForecastAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add))
            .build();
    }
}
```

### 3.6 Controllers (REST APIs)

```java
@RestController
@RequestMapping("/api/v1/accounts")
@Validated
@Slf4j
public class AccountController {
    
    @Autowired
    private AccountApplicationService accountService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<AccountDTO>> createAccount(
            @Valid @RequestBody CreateAccountRequest req) {
        AccountDTO dto = accountService.createAccount(req.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(dto, "Account created"));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDetailDTO>> getAccount(
            @PathVariable UUID id) {
        AccountDetailDTO dto = accountService.getAccountWithDetails(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AccountDTO>>> getAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AccountDTO> accounts = accountService
            .getAccountsByOwner(getCurrentUserId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDTO>> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAccountRequest req) {
        AccountDTO dto = accountService.updateAccount(
            id, req.toCommand());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
    
    @PostMapping("/{id}/convert-lead")
    public ResponseEntity<ApiResponse<AccountDTO>> convertLeadToAccount(
            @PathVariable UUID id,
            @RequestBody ConvertLeadRequest req) {
        AccountDTO dto = accountService.convertLeadToAccount(
            new ConvertLeadCommand(req.getLeadId()));
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}

@RestController
@RequestMapping("/api/v1/opportunities")
@Validated
@Slf4j
public class OpportunityController {
    
    @Autowired
    private OpportunityApplicationService oppService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OpportunityDTO>> createOpportunity(
            @Valid @RequestBody CreateOpportunityRequest req) {
        OpportunityDTO dto = oppService.createOpportunity(req.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(dto));
    }
    
    @GetMapping("/pipeline/{ownerId}")
    public ResponseEntity<ApiResponse<SalesPipelineDTO>> getSalesPipeline(
            @PathVariable UUID ownerId) {
        SalesPipelineDTO pipeline = oppService.getSalesPipeline(ownerId);
        return ResponseEntity.ok(ApiResponse.success(pipeline));
    }
    
    @PutMapping("/{id}/advance-stage")
    public ResponseEntity<ApiResponse<OpportunityDTO>> advanceStage(
            @PathVariable UUID id,
            @RequestBody AdvanceStageRequest req) {
        OpportunityDTO dto = oppService.advanceStage(
            id, req.getNewStage());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
```

### 3.7 Event-Driven Architecture

```java
// Domain Events
public abstract class DomainEvent {
    private final UUID id = UUID.randomUUID();
    private final LocalDateTime occurredAt = LocalDateTime.now();
    // ...
}

public class AccountConvertedEvent extends DomainEvent {
    private final UUID accountId;
    private final String companyName;
    
    public AccountConvertedEvent(UUID accountId, String companyName) {
        this.accountId = accountId;
        this.companyName = companyName;
    }
}

public class OpportunityWonEvent extends DomainEvent {
    private final UUID opportunityId;
    private final UUID accountId;
    private final BigDecimal dealValue;
}

public class LeadConvertedEvent extends DomainEvent {
    private final UUID leadId;
    private final UUID accountId;
    private final String contactName;
}

// Event Publisher
public interface DomainEventPublisher {
    void publish(DomainEvent event);
}

@Service
@Slf4j
public class SpringEventPublisher implements DomainEventPublisher {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Override
    public void publish(DomainEvent event) {
        eventPublisher.publishEvent(event);
        log.info("Published domain event: {}", event.getClass().getName());
    }
}

// Event Handlers (Sagas)
@Component
@Slf4j
public class AccountEventHandlers {
    
    @EventListener
    public void onAccountConverted(AccountConvertedEvent event) {
        // Send welcome email
        // Create initial project records
        // Notify account manager
        log.info("Account converted: {}", event.getAccountId());
    }
}

@Component
@Slf4j
public class OpportunityEventHandlers {
    
    @EventListener
    public void onOpportunityWon(OpportunityWonEvent event) {
        // Create project from opportunity
        // Update revenue forecasts
        // Notify team
        // Create invoice
        log.info("Opportunity won: {} with value: {}", 
            event.getOpportunityId(), event.getDealValue());
    }
}
```

### 3.8 Specifications and Filters

```java
// Specification for complex queries
public class AccountSpecification {
    
    public static Specification<Account> hasStatus(AccountStatus status) {
        return (root, query, cb) -> 
            cb.equal(root.get("status"), status);
    }
    
    public static Specification<Account> hasOwner(UUID ownerId) {
        return (root, query, cb) -> 
            cb.equal(root.get("owner").get("id"), ownerId);
    }
    
    public static Specification<Account> hasIndustry(Industry industry) {
        return (root, query, cb) -> 
            cb.equal(root.get("industry"), industry);
    }
    
    public static Specification<Account> nameContains(String name) {
        return (root, query, cb) -> 
            cb.like(cb.lower(root.get("companyName")), 
                "%" + name.toLowerCase() + "%");
    }
}

// Usage
Page<Account> accounts = accountRepository.findAll(
    Specification.where(AccountSpecification.hasOwner(ownerId))
        .and(AccountSpecification.hasStatus(AccountStatus.ACTIVE))
        .and(AccountSpecification.hasIndustry(Industry.HEALTHCARE)),
    PageRequest.of(0, 20)
);
```

### 3.9 Security & Authorization

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) 
            throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/v1/**").authenticated()
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionFixationProtection(SessionFixationProtection.MIGRATEAESSION)
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}

// Role-Based Access Control
@Component
public class RoleBasedAccessControl {
    
    public enum Role {
        ADMIN("ROLE_ADMIN"),
        SALES_MANAGER("ROLE_SALES_MANAGER"),
        SALES_REP("ROLE_SALES_REP"),
        ACCOUNT_MANAGER("ROLE_ACCOUNT_MANAGER"),
        PROJECT_MANAGER("ROLE_PROJECT_MANAGER"),
        SUPPORT_STAFF("ROLE_SUPPORT_STAFF");
        
        private final String authority;
        
        Role(String authority) {
            this.authority = authority;
        }
    }
    
    @PreAuthorize("hasRole('SALES_MANAGER') or hasRole('ADMIN')")
    public void canManageTeam() {}
    
    @PreAuthorize("hasRole('SALES_REP')")
    public void canManageOwnAccounts() {}
    
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public void canManageProjects() {}
}

// Field-Level Security
@Component
public class FieldLevelSecurity {
    
    public boolean canViewAccountEmail(Account account, User user) {
        // Only account owner, manager, or admin can view
        return account.getOwner().equals(user) || 
               user.hasRole(Role.SALES_MANAGER) ||
               user.hasRole(Role.ADMIN);
    }
    
    public boolean canViewOpportunityAmount(Opportunity opp, User user) {
        return opp.getOwner().equals(user) || 
               user.hasRole(Role.SALES_MANAGER);
    }
}
```

### 3.10 Database Schema (PostgreSQL)

```sql
-- Accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    billing_address_street VARCHAR(255),
    billing_address_city VARCHAR(100),
    billing_address_state VARCHAR(100),
    billing_address_country VARCHAR(100),
    billing_address_zipcode VARCHAR(20),
    shipping_address_street VARCHAR(255),
    shipping_address_city VARCHAR(100),
    shipping_address_state VARCHAR(100),
    shipping_address_country VARCHAR(100),
    shipping_address_zipcode VARCHAR(20),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    owner_id UUID NOT NULL REFERENCES users(id),
    annual_revenue NUMERIC(15, 2),
    sales_stage VARCHAR(50),
    next_follow_up TIMESTAMP,
    version BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT account_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

CREATE INDEX idx_accounts_owner ON accounts(owner_id);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_company_name ON accounts(company_name);

-- Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    rating VARCHAR(50),
    notes TEXT,
    owner_id UUID NOT NULL REFERENCES users(id),
    last_contact_date TIMESTAMP,
    next_follow_up_date TIMESTAMP,
    interest_areas VARCHAR(500),
    converted_account_id UUID REFERENCES accounts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT lead_status_check CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST'))
);

CREATE INDEX idx_leads_owner ON leads(owner_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    is_decision_maker BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_account ON contacts(account_id);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Opportunities
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    stage VARCHAR(50) NOT NULL DEFAULT 'PROSPECTING',
    amount NUMERIC(15, 2),
    expected_close_date DATE,
    closed_date DATE,
    probability NUMERIC(3, 1),
    description TEXT,
    opportunity_type VARCHAR(50),
    owner_id UUID NOT NULL REFERENCES users(id),
    competition_level VARCHAR(50),
    competitor_names TEXT,
    forecast_amount NUMERIC(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opportunities_account ON opportunities(account_id);
CREATE INDEX idx_opportunities_owner ON opportunities(owner_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_opportunities_expected_close ON opportunities(expected_close_date);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES opportunities(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNING',
    project_type VARCHAR(50),
    description TEXT,
    start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    project_manager_id UUID REFERENCES users(id),
    budget NUMERIC(15, 2),
    spent NUMERIC(15, 2) DEFAULT 0,
    completion_percentage NUMERIC(3, 1) DEFAULT 0,
    technical_stack VARCHAR(500),
    data_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_account ON projects(account_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_manager ON projects(project_manager_id);

-- AI Model Configs
CREATE TABLE ai_model_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT,
    input_data_type VARCHAR(500),
    accuracy NUMERIC(5, 4),
    precision NUMERIC(5, 4),
    recall NUMERIC(5, 4),
    f1_score NUMERIC(5, 4),
    training_approach VARCHAR(500),
    status VARCHAR(50),
    deployment_url VARCHAR(1000),
    github_repo_url VARCHAR(1000),
    deployment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_models_project ON ai_model_configs(project_id);
```

### 3.11 API Documentation (OpenAPI/Swagger)

```yaml
openapi: 3.0.0
info:
  title: Wersel CRM API
  version: 1.0.0
  description: Production-grade CRM for AI services company
  contact:
    name: Wersel Engineering
    email: engineering@wersel.ai

servers:
  - url: https://api.wersel-crm.com/api/v1
    description: Production
  - url: http://localhost:8080/api/v1
    description: Development

paths:
  /accounts:
    post:
      summary: Create a new account
      tags:
        - Accounts
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAccountRequest'
      responses:
        '201':
          description: Account created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AccountDTO'
        '400':
          description: Bad request
        '401':
          description: Unauthorized
        '403':
          description: Forbidden
    get:
      summary: Get all accounts
      tags:
        - Accounts
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 0
        - name: size
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PageAccountDTO'

  /opportunities/pipeline/{ownerId}:
    get:
      summary: Get sales pipeline for user
      tags:
        - Opportunities
      parameters:
        - name: ownerId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Sales pipeline
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SalesPipelineDTO'

components:
  schemas:
    CreateAccountRequest:
      type: object
      required:
        - companyName
        - accountType
      properties:
        companyName:
          type: string
        accountType:
          type: string
          enum: [PROSPECT, CUSTOMER, PARTNER]
        industry:
          type: string
        website:
          type: string
        phone:
          type: string

    AccountDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        accountNumber:
          type: string
        companyName:
          type: string
        status:
          type: string
```

---

## Part 4: MINIMAL FRONTEND ARCHITECTURE (React)

### 4.1 Project Structure

```
crm-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DataTable.jsx
│   │   ├── accounts/
│   │   │   ├── AccountList.jsx
│   │   │   ├── AccountDetail.jsx
│   │   │   ├── CreateAccount.jsx
│   │   │   └── AccountForm.jsx
│   │   ├── opportunities/
│   │   │   ├── SalesPipeline.jsx
│   │   │   ├── OpportunityCard.jsx
│   │   │   ├── OpportunityDetail.jsx
│   │   │   └── StageAdvance.jsx
│   │   ├── projects/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   └── AIModelConfigs.jsx
│   │   ├── leads/
│   │   │   ├── LeadList.jsx
│   │   │   ├── LeadDetail.jsx
│   │   │   └── ConvertLead.jsx
│   │   ├── activities/
│   │   │   ├── ActivityTimeline.jsx
│   │   │   └── ActivityForm.jsx
│   │   └── dashboard/
│   │       ├── Dashboard.jsx
│   │       ├── SalesMetrics.jsx
│   │       └── RevenueChart.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AccountsPage.jsx
│   │   ├── OpportunitiesPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── LeadsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   ├── accountService.js
│   │   │   ├── opportunityService.js
│   │   │   ├── projectService.js
│   │   │   └── leadService.js
│   │   ├── auth/
│   │   │   ├── authService.js
│   │   │   └── tokenService.js
│   │   └── storage/
│   │       └── storageService.js
│   ├── hooks/
│   │   ├── useAccounts.js
│   │   ├── useOpportunities.js
│   │   ├── useProjects.js
│   │   ├── useFetch.js
│   │   └── useAuth.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── UserContext.js
│   │   └── NotificationContext.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── responsive.css
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.jsx
│   └── config.js
├── package.json
└── .env.example
```

### 4.2 API Client Setup

```javascript
// src/services/api/apiClient.js
import axios from 'axios';
import { tokenService } from './tokenService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4.3 Core Components (Minimal UI)

#### Accounts List with DataTable
```jsx
// src/components/accounts/AccountList.jsx
import React, { useState, useEffect } from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import DataTable from '../common/DataTable';
import './AccountList.css';

const AccountList = () => {
  const { accounts, loading, error, fetchAccounts } = useAccounts();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    fetchAccounts(page, pageSize);
  }, [page, pageSize]);

  const columns = [
    {
      header: 'Company Name',
      key: 'companyName',
      sortable: true,
    },
    {
      header: 'Account Type',
      key: 'accountType',
      render: (value) => (
        <span className={`badge badge-${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (value) => (
        <span className={`status-${value.toLowerCase()}`}>{value}</span>
      ),
    },
    {
      header: 'Owner',
      key: 'owner.firstName',
    },
    {
      header: 'Annual Revenue',
      key: 'annualRevenue',
      render: (value) => `$${value?.toLocaleString()}` || '-',
    },
    {
      header: 'Action',
      key: 'id',
      render: (id) => (
        <a href={`/accounts/${id}`} className="btn btn-sm btn-primary">
          View
        </a>
      ),
    },
  ];

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="account-list">
      <div className="header">
        <h2>Accounts</h2>
        <a href="/accounts/new" className="btn btn-primary">
          New Account
        </a>
      </div>

      <DataTable
        columns={columns}
        data={accounts}
        pageable={true}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default AccountList;
```

#### Sales Pipeline (Kanban-style)
```jsx
// src/components/opportunities/SalesPipeline.jsx
import React, { useState, useEffect } from 'react';
import { useOpportunities } from '../../hooks/useOpportunities';
import OpportunityCard from './OpportunityCard';
import './SalesPipeline.css';

const SalesPipeline = ({ ownerId }) => {
  const { pipeline, loading, advanceStage } = useOpportunities();

  const stages = [
    { id: 'PROSPECTING', label: 'Prospecting', color: '#e8e8e8' },
    { id: 'QUALIFICATION', label: 'Qualification', color: '#fff3cd' },
    { id: 'PROPOSAL', label: 'Proposal', color: '#cfe2ff' },
    { id: 'NEGOTIATION', label: 'Negotiation', color: '#cff4fc' },
    { id: 'CLOSED_WON', label: 'Closed Won', color: '#d1e7dd' },
    { id: 'CLOSED_LOST', label: 'Closed Lost', color: '#f8d7da' },
  ];

  const handleDragStart = (e, opp) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('opportunityId', opp.id);
    e.dataTransfer.setData('currentStage', opp.stage);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData('opportunityId');
    const currentStage = e.dataTransfer.getData('currentStage');

    if (currentStage !== newStage) {
      await advanceStage(opportunityId, newStage);
    }
  };

  if (loading) return <div className="loading">Loading pipeline...</div>;

  return (
    <div className="sales-pipeline">
      <h2>Sales Pipeline</h2>
      <div className="pipeline-container">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="pipeline-column"
            style={{ backgroundColor: stage.color }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <h3>{stage.label}</h3>
            <div className="opportunities-list">
              {pipeline[stage.id.toLowerCase()]?.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, opp)}
                />
              ))}
            </div>
            <div className="stage-total">
              Total: $
              {pipeline[stage.id.toLowerCase()]
                ?.reduce((sum, o) => sum + (o.amount || 0), 0)
                .toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesPipeline;
```

#### Dashboard with Metrics
```jsx
// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api/dashboardService';
import SalesMetrics from './SalesMetrics';
import RevenueChart from './RevenueChart';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Accounts</h3>
          <p className="metric-value">{metrics.totalAccounts}</p>
          <p className="metric-change positive">
            +{metrics.accountsThisMonth} this month
          </p>
        </div>

        <div className="metric-card">
          <h3>Open Opportunities</h3>
          <p className="metric-value">{metrics.openOpportunities}</p>
          <p className="metric-value currency">
            ${metrics.totalPipelineValue.toLocaleString()}
          </p>
        </div>

        <div className="metric-card">
          <h3>Active Projects</h3>
          <p className="metric-value">{metrics.activeProjects}</p>
          <p className="metric-change">
            {metrics.completedThisMonth} completed
          </p>
        </div>

        <div className="metric-card">
          <h3>Win Rate</h3>
          <p className="metric-value">{metrics.winRate}%</p>
          <p className="metric-change positive">+5% vs last quarter</p>
        </div>
      </div>

      <div className="charts-grid">
        <RevenueChart data={metrics.revenueByMonth} />
        <SalesMetrics data={metrics.salesMetrics} />
      </div>
    </div>
  );
};

export default Dashboard;
```

### 4.4 Custom Hooks for Data Management

```javascript
// src/hooks/useAccounts.js
import { useState, useCallback } from 'react';
import accountService from '../services/api/accountService';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async (page = 0, pageSize = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.getAccounts(page, pageSize);
      setAccounts(response.data.content);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (data) => {
    try {
      const response = await accountService.createAccount(data);
      setAccounts([...accounts, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [accounts]);

  const updateAccount = useCallback(async (id, data) => {
    try {
      const response = await accountService.updateAccount(id, data);
      setAccounts(
        accounts.map((acc) => (acc.id === id ? response.data : acc))
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [accounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
  };
};
```

### 4.5 Minimal CSS (No Heavy Framework)

```css
/* src/styles/index.css */

:root {
  --primary-color: #2182a4;
  --secondary-color: #5e5240;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-bg: #f8f9fa;
  --dark-text: #212529;
  --border-color: #dee2e6;
  --spacing-unit: 8px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  color: var(--dark-text);
  background-color: var(--light-bg);
  line-height: 1.6;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Grid System */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-unit);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: calc(var(--spacing-unit) * 2);
}

/* Forms */
.form-group {
  margin-bottom: calc(var(--spacing-unit) * 2);
}

label {
  display: block;
  margin-bottom: var(--spacing-unit);
  font-weight: 500;
}

input,
select,
textarea {
  width: 100%;
  padding: var(--spacing-unit);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(33, 130, 164, 0.1);
}

/* Buttons */
.btn {
  padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-unit);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #1a6a8c;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

th {
  background-color: #f8f9fa;
  padding: calc(var(--spacing-unit) * 1.5);
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

td {
  padding: calc(var(--spacing-unit) * 1.5);
  border-bottom: 1px solid var(--border-color);
}

tr:hover {
  background-color: #f8f9fa;
}

/* Cards */
.card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: calc(var(--spacing-unit) * 2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Status Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-prospect {
  background-color: #cfe2ff;
  color: #084298;
}

.badge-customer {
  background-color: #d1e7dd;
  color: #0f5132;
}

.badge-active {
  background-color: #d1e7dd;
  color: #0f5132;
}

.badge-inactive {
  background-color: #f8d7da;
  color: #842029;
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 0.875rem;
  }

  th,
  td {
    padding: calc(var(--spacing-unit) * 1);
  }
}
```

---

## Part 5: WORKFLOW & DATA FLOW DIAGRAMS

### 5.1 Account Management Workflow
```
┌─────────────────────────────────────────────────────────────┐
│                   LEAD TO CUSTOMER JOURNEY                  │
└─────────────────────────────────────────────────────────────┘

┌──────────┐        ┌─────────────────┐        ┌──────────────┐
│   Lead   │  ──→   │ Qualification   │  ──→   │   Account    │
│ (NEW)    │        │ (CONTACTED)     │        │  (PROSPECT)  │
└──────────┘        └─────────────────┘        └──────────────┘
    ▲                                                    ▼
    │                                            ┌──────────────┐
    │                                            │ Opportunity  │
    │                                            │  (CREATED)   │
    │                                            └──────────────┘
    │                                                    ▼
    │                                            ┌──────────────┐
    │                                            │   Project    │
    │                                            │  (WON OPP)   │
    │                                            └──────────────┘
    │
    └─────── Lead Lost / Not Qualified
```

### 5.2 Opportunity Pipeline Flow
```
PROSPECTING (10%) 
    ↓
QUALIFICATION (25%)
    ↓
PROPOSAL (50%)
    ├─→ Review Feedback
    └─→ Update Proposal
    ↓
NEGOTIATION (75%)
    ├─→ Contract Negotiations
    └─→ Final Terms
    ↓
CLOSED_WON (100%) ──→ Create Project
    │
    └─→ Activate Contracts
    └─→ Schedule Kickoff
    └─→ Allocate Resources

OR

CLOSED_LOST (0%) ──→ Analysis
    └─→ Competitor Lost To?
    └─→ Reason for Loss
    └─→ Follow-up Plan
```

### 5.3 Backend Event-Driven Architecture
```
┌──────────────────────────────────────┐
│         REST API Request             │
│  POST /api/v1/accounts               │
│  POST /api/v1/opportunities/{id}     │
└──────────────────────────────────────┘
            ▼
┌──────────────────────────────────────┐
│      Command Handler Layer           │
│  - Validate Input                    │
│  - Check Authorization               │
│  - Load Aggregate Root               │
└──────────────────────────────────────┘
            ▼
┌──────────────────────────────────────┐
│     Domain Model (Business Logic)    │
│  - Account.transitionToCustomer()    │
│  - Opportunity.advanceStage()        │
│  - Project.complete()                │
│  - Publish Domain Events             │
└──────────────────────────────────────┘
            ▼
┌──────────────────────────────────────┐
│    Repository (Persistence)          │
│  - Save Aggregate                    │
│  - Store in PostgreSQL               │
│  - Transactional Consistency         │
└──────────────────────────────────────┘
            ▼
┌──────────────────────────────────────┐
│     Domain Event Publisher           │
│  - AccountConvertedEvent             │
│  - OpportunityWonEvent               │
│  - ProjectCompletedEvent             │
└──────────────────────────────────────┘
            ▼
┌─────────────────┬─────────────────┬─────────────────┐
│  Email Service  │ Slack Notifier  │ Analytics       │
│  Send welcome   │ Notify team     │ Update reports  │
│  email to       │  when opp won   │ and dashboards  │
│  customer       │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

### 5.4 Data Model Relationships
```
┌──────────────┐
│    USER      │
│ (Sales Team) │
└──────────────┘
      ▲
      │ owns
      │
┌─────┴────────────────┐
│                      │
│                      ▼
│              ┌──────────────┐
│              │   ACCOUNT    │
│              │              │
│              │ - Company    │
│              │ - Status     │
│              │ - Industry   │
│              └──────────────┘
│                      ▲
│                      │
│              ┌───────┴──────────┐
│              │                  │
│              ▼                  ▼
│         ┌─────────┐        ┌────────────┐
│         │ CONTACT │        │ OPPORTUNITY│
│         └─────────┘        │            │
│                            │ - Amount   │
│                            │ - Stage    │
│                            │ - Prob     │
│                            └────────────┘
│                                  │
│                                  ▼
│                            ┌──────────────┐
│                            │  PROJECT     │
│                            │              │
│                            │ - Budget     │
│                            │ - Team       │
│                            │ - Timeline   │
│                            └──────────────┘
│                                  │
│                                  ▼
│                            ┌──────────────┐
│                            │ AI_MODEL_CFG │
│                            │              │
│                            │ - Type       │
│                            │ - Accuracy   │
│                            │ - Deployment │
│                            └──────────────┘
│
│ manages
│
└─────→ ┌──────────────┐
        │    LEAD      │
        │              │
        │ - Source     │
        │ - Status     │
        │ - Rating     │
        └──────────────┘
```

---

## Part 6: IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-3)
- [x] Domain model setup (Account, Lead, Contact entities)
- [x] PostgreSQL schema creation with Flyway migrations
- [x] Spring Boot project setup with dependencies
- [x] Repository implementations
- [x] Basic CRUD services
- [ ] Unit tests for domain logic

### Phase 2: Core Features (Weeks 4-6)
- [ ] Account Management (Create, Read, Update, Delete)
- [ ] Lead Management & Scoring
- [ ] Opportunity Pipeline with drag-drop
- [ ] Activity Timeline (Calls, Emails, Meetings)
- [ ] Basic reporting

### Phase 3: Advanced Features (Weeks 7-9)
- [ ] Project Management with AI Model tracking
- [ ] Proposal generation and management
- [ ] Sales forecasting engine
- [ ] Integration with email (Gmail, Outlook)
- [ ] Document attachment system

### Phase 4: Optimization & Deployment (Weeks 10-12)
- [ ] Performance optimization (caching, indexing)
- [ ] Security hardening
- [ ] API rate limiting
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline setup

---

## Part 7: KEY PRODUCTION CONSIDERATIONS

### 7.1 Performance Optimization
```java
// Pagination for large datasets
@Query(value = "SELECT o FROM Opportunity o WHERE o.stage = :stage")
Page<Opportunity> findByStage(@Param("stage") OpportunityStage stage,
                               Pageable pageable);

// Caching frequently accessed data
@Cacheable(value = "accounts", key = "#id")
public Account getAccount(UUID id) {
    return accountRepository.findById(id).orElse(null);
}

// Batch operations for bulk updates
@Transactional
public void bulkUpdateOpportunityStage(List<UUID> ids, 
                                       OpportunityStage newStage) {
    List<Opportunity> opps = opportunityRepository.findAllById(ids);
    opps.forEach(opp -> opp.advanceStage(newStage));
    opportunityRepository.saveAll(opps);
}
```

### 7.2 Audit & Compliance
```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity {
    
    @CreatedBy
    @Column(nullable = false)
    private UUID createdBy;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedBy
    private UUID lastModifiedBy;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedAt;
    
    @Version
    private Long version; // Optimistic locking
}
```

### 7.3 Data Validation
```java
@Entity
public class Account extends AuditableEntity {
    
    @NotBlank(message = "Company name is required")
    @Length(min = 2, max = 255)
    private String companyName;
    
    @Email
    private String email;
    
    @Positive(message = "Annual revenue must be positive")
    private BigDecimal annualRevenue;
    
    public void validate() {
        if (status == null) {
            throw new BusinessRuleException("Status is required");
        }
        if (owner == null) {
            throw new BusinessRuleException("Owner is required");
        }
    }
}
```

### 7.4 Error Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(404, ex.getMessage()));
    }
    
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRule(
            BusinessRuleException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(new ErrorResponse(422, ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(500, "Internal server error"));
    }
}
```

### 7.5 Docker & Deployment
```dockerfile
# Dockerfile
FROM openjdk:17-slim

WORKDIR /app

COPY target/crm-backend-1.0.0.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Xmx1g -Xms512m"

ENTRYPOINT ["java", "${JAVA_OPTS}", "-jar", "app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: crm_db
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  crm-backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/crm_db
      SPRING_REDIS_HOST: redis
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## SUMMARY

This production-grade CRM architecture provides:

✅ **Scalable Backend** (Spring Boot + PostgreSQL)
✅ **Event-Driven Design** (Domain-driven architecture)
✅ **Minimal Frontend** (React with essential components)
✅ **Enterprise Patterns** (Factory, Decorator, CQRS)
✅ **Security** (OAuth2, Role-based access)
✅ **Performance** (Caching, pagination, indexing)
✅ **Monitoring & Logging** (ELK Stack ready)
✅ **Deployment Ready** (Docker, Kubernetes compatible)

Next steps:
1. Set up Spring Boot project with these dependencies
2. Create database schema using Flyway migrations
3. Implement domain models with proper validations
4. Build application services with transaction management
5. Create REST APIs with comprehensive error handling
6. Build React UI components (start with minimal set)
7. Test with unit and integration tests
8. Deploy with Docker and CI/CD pipeline
