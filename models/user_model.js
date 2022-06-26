class User {
    nickname;
    current_level;
    level_rank;
    avatars;
    gender;
    is_notification;
    time_of_register;
    play_dates;
   

    constructor(nickname, email,password,avatars,gender){
        this.nickname=nickname;
        this.email=email;
        this.password = password;
        this.level_rank = [{"level_code":1,"rank":0}]
        this.avatars = avatars;
        this.current_level = 1;
        this.gender = gender;
        this.is_notification=true;
        this.time_of_register=new Date().getDate();
        this.play_dates=[{"start_date":new Date().getDate(),"end_date":new Date().getDate()}]

    }
}

module.exports = User;