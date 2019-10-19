



module.exports = [
    {name: "Day", duration: 10, isFirst: true, next: "Night", iterations: 0},
    {name: "Night", duration: 10, next: "Day"},
    {name: "Defense", duration: 10, next: "Judgement"},
    {name: "Judgement", duration: 10, next: "Last Words"},
    {name: "Last Words", duration: 5, next: "Night"},
    {name: "Secret", duration: 9, next: "Night"}
]