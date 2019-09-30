



module.exports = [
    {name: "Day", duration: 30, isFirst: true, next: "Night", iterations: 0},
    {name: "Night", duration: 30, next: "Day"},
    {name: "Defense", duration: 10, next: "Judgement"},
    {name: "Judgement", duration: 30, next: "Last Words"},
    {name: "Last Words", duration: 5, next: "Night"}
]