@echo off
For /f "Delims=:" %A in ('tasklist /v /fi "WINDOWTITLE eq VitrualHere Client"') do @if %A==INFO echo Prog not running

