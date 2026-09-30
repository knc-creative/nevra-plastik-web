<?php
/* ==========================================================================
   Nevra Plastik - Hostinger Setup Token Configuration Template
   ==========================================================================
   How to use on Hostinger / Production:
   1. Copy this file to 'setup_token.php' inside api/data/
   2. Replace 'YOUR_STRONG_RANDOM_TOKEN_HERE' with a secure 32-byte hex token (e.g. bin2hex(random_bytes(32)))
   3. Complete first-run setup in nevracms.html by entering the token and new admin password.
   4. Once setup is complete, password_hash is saved in credentials.json and setup_admin is permanently disabled.
   ========================================================================== */

define('NEVRA_SETUP_TOKEN', 'YOUR_STRONG_RANDOM_TOKEN_HERE');
?>
