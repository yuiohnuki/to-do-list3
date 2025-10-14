Auto-commit helper

This repository includes a small PowerShell script to automatically commit local changes on a schedule.

Quick usage

# Run one check and commit if needed
powershell -ExecutionPolicy Bypass -File .\auto_commit.ps1 -Once

# Run in a loop (default 60 minutes)
powershell -ExecutionPolicy Bypass -File .\auto_commit.ps1

# Run and push after commit
powershell -ExecutionPolicy Bypass -File .\auto_commit.ps1 -Push

Initialize repo if needed

powershell -ExecutionPolicy Bypass -File .\auto_commit.ps1 -InitIfMissing

Register as a Windows Scheduled Task (runs every hour)

# Open an elevated PowerShell and run these commands (update paths as needed)
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "C:\Users\ohnuk\OneDrive\Desktop\todolist\auto_commit.ps1"'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 60) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -TaskName 'Todo Auto Commit' -Action $action -Trigger $trigger -RunLevel Highest

Notes
- Make sure Git is installed and available from PATH.
- If pushing to a remote, configure authentication (credential manager, SSH keys, or cached credentials).