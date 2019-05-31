# TGLib

The official Testing Grounds library. Contains "Town Of Salem" logic, roles, actions and all. This library tries to copy the logic of "Town Of Salem" and add more on top of it. 

**Integrated Differences:**

- Plurality
- No default listener for Judgement ("Innocent" / "Guilty") phase
- Players can vote for "Nolynch". 

Of course, using this you may change whatever you want - you can add more phases, roles and mechanics.

## Code Structure

There are 4 types of objects: 

`DataTypes`: Those are the `Collection` and `PriorityList` - Classes used to store data.      
`Structures`: These usually represent something *in* town of salem. For example a player, a role, a night action, a phase, etc.       
`Collectors`: Collectors collect structures and put them in `Collections` (A class that extends the `Map` class). They also make useful methods and properties regarding the collected structures accessible.       
`Main Classes`: The main classes tie everything together and make it work. The `Timer` class creates the game loop and keeps track of time, the `ActionManager` keeps and executes night actions and the `Engine` class makes everything accessible.      

## Wiki 

This repo's wiki explains everything in detail. Check it out here: https://github.com/GoogleFeud/TGLib/wiki



