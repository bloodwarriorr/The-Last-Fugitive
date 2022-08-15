class User {
    nickname;
    current_level;
    level_rank;
    avatarCode;
    gender;
    is_notification;
    time_of_register;
    play_dates;
    avatarUrl;
   

    constructor(nickname, email,password,avatarCode,gender,avatarUrl){
        this.nickname=nickname;
        this.email=email;
        this.password = password;
        this.level_rank = [{"level_code":1,"rank":0}]
        this.avatarCode = avatarCode;
        this.current_level = 1;
        this.gender = gender;
        this.avatarUrl=avatarUrl;
        this.is_notification=true;
        this.time_of_register=new Date();
        this.play_dates=[]

    }
}

module.exports = User;