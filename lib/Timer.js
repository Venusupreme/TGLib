
class Timer {
    constructor(engine) {
        this.engine = engine;
        this.paused = false;
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

     timeleft() {
        let secsleft = this.game.phases.current.duration - this.seconds;
        let mins = Math.floor(secsleft / 60);
         return {
             seconds: secsleft - mins * 60,
             minutes: mins
         }
     }

     pause() {
         this.paused = true;
     }

     resume() {
         this.paused = false;
     }

     stop() {
         clearInterval(this.interval);
         this.elapsed = 0.0;
         this.startedAt = null;
         this.paused = false;
     }

     reset() {
         this.elapsed = -0.1;
         this.startedAt = new Date().getTime();
     }

}

module.exports = Timer;
