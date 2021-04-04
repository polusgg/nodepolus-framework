Conventions:
  Convert boolean to number: `val ? 1 : 0`
  Convert number to boolean: `!!val`
  New array: `new Array(size)`
  String to Number: `parseInt(string, 10)`
When checking if a variable is undefined, always use `===` or `!==` in `if` statements and ternary checks
Always `delete` a timeout/interval after clearing it
Use `instanceof Array` over `Array.isArray`
Be explicit when checking for undefined variables (`if (obj !== undefined)` vs `if (obj)`)
BE FUCKING CONSISTENT



timer    value
3        9          Enter  | HeadingUp    <---
2        9          Enter  | HeadingUp       | - Office doors opened from outside and counting down to close
1        9          Enter  | HeadingUp    <---
3        a          Closed | HeadingUp    <---
2        a          Closed | HeadingUp       | - Sprayers running
1        a          Closed | HeadingUp    <---
3        c          Exit   | HeadingUp    <---
2        c          Exit   | HeadingUp       | - Specimens doors opened and conting down to close
1        c          Exit   | HeadingUp    <---
0        0          Idle


timer    value
3        1          Enter     <---
2        1          Enter        | - Specimens doors opened from outsideand counting down to close
1        1          Enter     <---
3        2          Closed    <---
2        2          Closed       | - Sprayers running
1        2          Closed    <---
3        4          Exit      <---
2        4          Exit         | - Office doors opened and counting down to close
1        4          Exit      <---
0        0          Idle


timer    value
3        4          Exit      <---
2        4          Exit         | - Office doors opened from insde and counting down to close
1        4          Exit      <---
0        0          Idle


timer    value
3        c          Exit | HeadingUp      <---
2        c          Exit | HeadingUp         | - Specimens doors opened from inside and counting down to close
1        c          Exit | HeadingUp      <---
0        0          Idle



MovingPlatformBehaviour
  byte: useId (sequence ID)
  uint32: target (PlayerControl)
  boolean: isLeft

ClimbLadder RPC
  byte: id (ladder ID)
  // How does the ladder ID tell which ladder to use?
  // There are two ladders with the same ID (electrical, gap room)

HeliSabotageSystem
  HashSet<Tuple<byte, byte>>: activeConsoles
  HastSet<byte>: completedConsoles

Switch, 7 [7]
Medscan, 10 [10]
Doors, 16 [16]
MovingPlatformBehaviour, 44 [12]
HeliSabotageSystem, 3 [3]
SecurityCameras, 11 [11]
Sabotage, 17 [17]
