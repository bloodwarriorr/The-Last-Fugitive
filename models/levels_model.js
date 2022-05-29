class Level {
    code;
    map;
    player;
    enemies;
    step_cap;
    difficulty;
    popularity;
  
   

    constructor(code,map,player,enemies,step_cap,difficulty){
        this.code=code
        this.map=map
        this.player=player
        this.enemies=enemies
        this.step_cap=step_cap
        this.difficulty=difficulty
        this.popularity=0

    }
}

module.exports = Level;