class Timer {
    constructor(engine) {
        this.engine = engine;
        this.elapsed = 0.0;
        this.startedAt = null;
    }

     loop(fn) {
         this.startedAt = new Date().getTime();
         let lastElapsed = null;
         this.interval = setInterval(() => {
                if (!this.paused) {
                    let time = new Date().getTime() - this.startedAt;
                    this.elapsed = Math.floor(time / 100) / 10;
                    if (lastElapsed == this.elapsed) return;
                    lastElapsed = this.elapsed;
                    fn(this);
                }
         });
     }

     timeLeft() {
        let secsleft = this.engine.phases.current.duration - Math.round(this.elapsed);
        let mins = Math.floor(secsleft / 60);
         return {
             seconds: secsleft - mins * 60,
             minutes: mins
         }
     }


     stop() {
         clearInterval(this.interval);
         this.elapsed = 0.0;
         this.startedAt = null;
     }

     reset(newTime) {
         this.startedAt = new Date().getTime();
         this.elapsed = newTime || 0;
     }

}

module.exports = Timer;