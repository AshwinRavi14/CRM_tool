$baseUrl = "http://localhost:3000/api/v1"
$adminEmail = "admin@wersel.ai"
$password = "password123"

Write-Host "--- 1. Testing Login ---"
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{email = $adminEmail; password = $password } | ConvertTo-Json) -ContentType "application/json" -SessionVariable session
    $token = $loginResponse.data.accessToken
    Write-Host "Login Successful. Token received." -ForegroundColor Green
}
catch {
    Write-Host "Login Failed: $_" -ForegroundColor Red
    exit
}

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "`n--- 2. Testing Get Profile (/auth/me) ---"
try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers -WebSession $session
    Write-Host "Profile Retrieved: $($meResponse.data.firstName) $($meResponse.data.lastName)" -ForegroundColor Green
}
catch {
    Write-Host "Get Profile Failed: $_" -ForegroundColor Red
}

Write-Host "`n--- 3. Testing Leads Module (Get All) ---"
try {
    $leadsResponse = Invoke-RestMethod -Uri "$baseUrl/leads" -Method Get -Headers $headers -WebSession $session
    Write-Host "Leads Retrieved: $($leadsResponse.data.count) leads found." -ForegroundColor Green
}
catch {
    Write-Host "Get Leads Failed: $_" -ForegroundColor Red
}

Write-Host "`n--- 4. Testing Leads Module (Create) ---"
try {
    $newLead = @{
        firstName = "Test";
        lastName  = "Lead";
        email     = "testlead@example.com";
        phone     = "1234567890";
        company   = "Test Corp";
        source    = "WEBSITE"
    }
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/leads" -Method Post -Body ($newLead | ConvertTo-Json) -ContentType "application/json" -Headers $headers -WebSession $session
    Write-Host "Lead Created ID: $($createResponse.data._id)" -ForegroundColor Green
}
catch {
    Write-Host "Create Lead Failed: $_" -ForegroundColor Red
}

Write-Host "`n--- 5. Testing Logout ---"
try {
    $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" -Method Post -Headers $headers -WebSession $session
    Write-Host "Logout Successful." -ForegroundColor Green
}
catch {
    Write-Host "Logout Failed: $_" -ForegroundColor Red
}
