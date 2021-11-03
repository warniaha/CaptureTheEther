:start
call truffle test --network ropsten --compile-none
time <nul:
if errorlevel 1 goto start
