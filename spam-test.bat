:start

time <nul:
call truffle test --network ropsten --compile-none

if errorlevel 1 goto start
