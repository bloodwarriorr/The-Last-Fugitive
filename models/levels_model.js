class Level {
    code=0;
    map;
    player;
    enemies;
    step_cap;
    difficulty;
    popularity;
  
   

    constructor(map,player,enemies,step_cap,difficulty){
        this.code+=1
        this.map=map
        this.player=player
        this.enemies=enemies
        this.step_cap=step_cap
        this.difficulty=difficulty
        this.popularity=0

    }
}

module.exports = Level;