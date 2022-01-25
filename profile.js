class Profile {
    constructor(userName, image, name, gender, birthday, age, height, weight, location, school,
                grade, major, personality, hobby, wechatID, selfDescription, CP_gender, CP_age,
                CP_height, CP_weight, CP_hobby, CP_personality, CP_major, CP_location) {
        this.userName = userName;
        this.image = image;
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
        this.age = age;
        this.height = height;
        this.weight = weight;
        this.location = location;
        this.school = school;
        this.grade = grade;
        this.major = major;
        this.personality = personality;
        this.hobby = hobby;
        this.wechatID = wechatID;
        this.selfDescription = selfDescription;
        this.CP_gender = CP_gender;
        this.CP_age = CP_age;
        this.CP_height = CP_height;
        this.CP_weight = CP_weight;
        this.CP_hobby = CP_hobby;
        this.CP_personality = CP_personality;
        this.CP_major = CP_major;
        this.CP_location = CP_location;
    }
}

module.exports = Profile;