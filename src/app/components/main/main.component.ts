import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

const CIRCLES = [7, 7, 7]
const SOUNDS = [{ 
  value: 'sound1',
  title: 'Тихий'
},{ 
  value: 'sound2',
  title: 'Громче'
},{ 
  value: 'sound3',
  title: 'Шромкий'
}]
const MODES = [{ 
  value: 0,
  title: 'Без звука'
},{ 
  value: 1,
  title: 'Звук на каждый вдох выдох'
},{ 
  value: 2,
  title: 'Звук на каждый вдох'
},{ 
  value: 3,
  title: 'Звук на каждый цикл'
}]

type Mode = typeof MODES[0]

const breathMS = 3333 
const halfBreathMS = breathMS / 2 
// const steps = 

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class AppMainComponent implements OnInit {
  counter = 1;
  tickCounter = 0;
  isBreath = true;
  isRun = false;
  circles = [...CIRCLES]
  circleIndex = 0;
  countdown = 3;
  private audio: HTMLAudioElement = new Audio();
  private intervalId!: ReturnType<typeof setInterval>;
  modes = MODES
  sounds = SOUNDS
  
  modeFc = new FormControl<number>(this.modes[1].value);
  soundFc = new FormControl<string>(this.sounds[0].value);
  deferStartFC = new FormControl<boolean>(true);
  form = new FormGroup({
    modeFc: this.modeFc,
    soundFc: this.soundFc,
    deferStartFC: this.deferStartFC
  });


  ngOnInit() {
    this.soundFc.valueChanges.subscribe(() => this.loadSound(this.soundFc.value as string))
  }

  loadSound(name: any) {
    console.log(name);
    
    this.audio.src = `../../../assets/${name}.mp3`;
    this.audio.load();
  }

  onClick( ) {
    this.isRun = !this.isRun
    this.isRun ? this.start() : this.stop()
  }

  stop() {
    this.form.enable()
    clearInterval(this.intervalId)
    this.counter = 1
    this.tickCounter = 0
    this.countdown = 3
    this.circles = [...CIRCLES]
    this.circleIndex = 0
  }

  playSound() {
    const mode = Number(this.modeFc.value)
    if (mode === 1) {
      this.audio.play();
    } else if(mode === 2 && this.tickCounter % 2 === 0) {
      this.audio.play();
    } else if(mode === 3 && this.tickCounter % 14 === 0) {
      this.audio.play();
    }
  }

  start() {
    this.form.disable()
    this.countdown = 3
    if(this.deferStartFC.value) {
      this.countdown = 3
      this.deferRun()
    }  else {
      this.run()
    }
  }

  run() {
    this.audio.play();
    this.intervalId = setInterval(() => this.tick(), halfBreathMS);
  }

  deferRun() {
    setTimeout(() => {
      this.countdown--
      this.countdown === 0 ? this.run() : this.deferRun()
    }, 900)
  }

  tick() {
    this.isBreath = !this.isBreath; 
    if (this.isBreath) {
      this.circles[this.circleIndex]--
      this.counter++;
      if (this.circles[this.circleIndex] === 0) {
        if (this.circleIndex === this.circles.length - 1) {
          this.stop();
          this.playSound();
          return;
        }
        this.circleIndex++
        this.counter = 1;
      }
    }
    this.tickCounter++
    console.log(this.tickCounter, this.tickCounter % 14);
    
    this.playSound();
  }

}
