# TGLib

The official Testing Grounds library. Contains "Town Of Salem" logic, roles, actions and all. This library tries to copy the logic of "Town Of Salem" and add more on top of it. 

**THE CODE ISN'T FULLY DOCUMENTED JUST YET! WORKING ON THAT**

**Integrated Differences:**

- Plurality (Not In TG tho)
- No lynch is an option

Of course, there are many other differences that come with [TGServer](https://github.com/GoogleFeud/TGServer), mainly phase times and roles.

## Code Structure

There are 3 main types of objects: 

`DataTypes`: Those are the `Unit` and `PriorityList` - Classes used to store data.      
`Structures`: These usually represent something *in* town of salem. For example a player, a role, a night action, a phase, etc.       
`Collectors`: Collectors collect structures and put them in `Units` (A class that extends the `Map` class). They also make useful methods and properties regarding the collected structures accessible.              

## Version 

The current version of TGLib is: `1.0rc1`


