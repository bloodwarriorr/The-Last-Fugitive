const { MongoClient, ObjectId } = require('mongodb');

class DB {
    client;
    dbName;

    constructor() {
        this.client = new MongoClient(process.env.DB_URI);
        this.dbName = process.env.DB_NAME;
    }

    async FindAll(collection, options = {}) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).find(options).toArray();
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    async FindByID(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ _id: ObjectId(id) });
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    async FindByUID(collection, uid) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ uid: uid });
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    //help function for find user id in token collection
    async FindByUserId(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ userId: ObjectId(id) });
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    async FindByEmail(collection, emailToSearch) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ email: emailToSearch });
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    async Insert(collection, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).insertOne(doc);
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    async InsertMany(collection, docs) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).insertMany(docs);
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    async UpdateDocById(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: doc });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }

    async DeactivateDocById(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { isActive: false } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    async DeleteDocById(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).deleteOne(
                { _id: ObjectId(id) });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }

    async ReactivateDocById(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { isActive: true } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }


    //aggregate functions:
    //popular levels according to popularity rate
    async PopularLevelMapReduce(collection) {
        let mapArr = []
        const pipeline = [
            { '$unwind': "$level_rank" },
            { '$group': { '_id': "$level_rank.level_code", 'Value': { '$sum': '$level_rank.popularity' } } },
            { '$limit': 3 }
        ]
        try {
            await this.client.connect();
            const aggregateCursor = this.client.db(this.dbName).collection(collection).aggregate(pipeline)
            for await (const doc of aggregateCursor)
                mapArr.push(doc)
            return mapArr
        }
        catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    //Total year regestation
    async AmountOfRegestation(collection, year) {
        let mapArr = []
        const pipeline = [
            { '$match': { 'time_of_register': { '$gte': new Date(`${year}-01-01T08:16:53.126Z`) } } },
            {
                '$group': {
                    '_id': { '$dateToString': { 'format': "%Y-%m-%d", 'date': "$time_of_register" } },
                    'Value': { '$sum': 1 }
                }
            },

        ]
        try {
            await this.client.connect();
            const aggregateCursor = this.client.db(this.dbName).collection(collection).aggregate(pipeline)
            for await (const doc of aggregateCursor)
                mapArr.push(doc)
            return mapArr
        }
        catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    //avg of user ranking per level
    async LevelRankningAvg(collection) {
        let mapArr = []
        const pipeline = [
            { '$unwind': '$level_rank' },
            {
                '$group': {
                    '_id': '$level_rank.level_code',
                    'Value': { '$avg': { '$sum': '$level_rank.rank' } }
                }
            },

        ]
        try {
            await this.client.connect();
            const aggregateCursor = this.client.db(this.dbName).collection(collection).aggregate(pipeline)
            for await (const doc of aggregateCursor)
                mapArr.push(doc)
            return mapArr
        }
        catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    //Popular playtime hours
    async PlayTimeHoursPop(collection) {
        let mapArr = []
        const pipeline = [
            { '$unwind': '$play_dates' },
            {
                '$group': {
                    '_id': {'$hour':{'$toDate':"$play_dates.start_date"}},
                    'Hours': {
                        '$sum': {
                            '$dateDiff':
                            {
                               'startDate': {'$toDate':"$play_dates.start_date"},
                               'endDate': {'$toDate':"$play_dates.end_date"},
                               'unit': "minute"
                            }
                        }
                    },

                }
            },

        ]

        try {
            await this.client.connect();
            const aggregateCursor = this.client.db(this.dbName).collection(collection).aggregate(pipeline)
           
            for await (const doc of aggregateCursor) {
                
                mapArr.push(doc)
            }
            return mapArr
        }
        catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    //Popular playtime hours
    // async PlayTimeHoursPop(collection) {
    //     let mapArr = []
    // const popularHoursMap2 = function () {
    //     var hours_Arr = []
    //     for (i = 0; i < this.play_dates.length; i++) {
    //         var start_hour = this.play_dates[i].start_date.getUTCHours()
    //         var hoursAmount = Math.round(Math.abs(this.play_dates[i].start_date - this.play_dates[i].end_date) / 36e5)

    //         for (j = 0; j < hoursAmount; j++) {
    //             hours_Arr.push((start_hour + j) % 24)
    //         }
    //     }
    //     for (i = 0; i < hours_Arr.length; i++) {
    //         emit(hours_Arr[i], 1)
    //     }
    // }
    //     const pipeline = [
    //         {
    //            'consensus':
    //         },
    //         {
    //             '$group': {
    //                 '_id': { '$hour': { '$toDate': "$play_dates.start_date" } },
    //                 'Value': {
    //                     '$sum': {
    //                         '$dateDiff':
    //                         {
    //                             'startDate': { '$toDate': "$play_dates.start_date" },
    //                             'endDate': { '$toDate': "$play_dates.end_date" },
    //                             'unit': "hour"
    //                         }
    //                     }
    //                 },

    //             }
    //         },

    //     ]
    //     try {
    //         await this.client.connect();
    //         const aggregateCursor = this.client.db(this.dbName).collection(collection).aggregate(pipeline)
    //         console.log(aggregateCursor)
    //         for await (const doc of aggregateCursor) {
    //             mapArr.push(doc)
    //         }
    //         return mapArr
    //     }
    //     catch (error) {
    //         return error;
    //     } finally {
    //         await this.client.close();
    //     }
    // }
    async example(collection) {
        var popularHoursMapReduce2 = function () {
            db.users.mapReduce(
                popularHoursMap2,
                popularHoursReduce2,
                {
                    out: "popular_hours_levels2"
                }
            )

        }

        var popularHoursMap2 = function () {
            var hours_Arr = []
            for (i = 0; i < this.play_dates.length; i++) {
                var start_hour = this.play_dates[i].start_date.getUTCHours()
                var hoursAmount = Math.round(Math.abs(this.play_dates[i].start_date - this.play_dates[i].end_date) / 36e5)

                for (j = 0; j < hoursAmount; j++) {
                    hours_Arr.push((start_hour + j) % 24)
                }
            }
            for (i = 0; i < hours_Arr.length; i++) {
                emit(hours_Arr[i], 1)
            }
        }


        var popularHoursReduce2 = function (hours, values) {
            hourCounter = 0
            for (i = 0; i < values.length; i++) {
                hourCounter += values[i]

            }
            return hourCounter;
        }
    }



    //optional, not in use right now!!
    //get avatar url by gender code:
    async FindByAvatarCode(collection, avatarToSearch, genderCode) {
        let type = genderCode === 1 ? "male" : "female";
        let result
        const pipeline = [
            { '$unwind': "$options" },
            { '$match': { "options.code": Number(avatarToSearch), 'gender': type } },
            { '$group': { '_id': null, 'Value': { '$addToSet': "$options.url" } } }
        ]

        try {
            await this.client.connect();
            const aggregateCursor = this.client.db(this.dbName).collection(collection).aggregate(pipeline)
            for await (const doc of aggregateCursor)
                result = doc
            return result.Value[0]
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    async FindGuestByNickname(collection, nickName) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ nickname: nickName });
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    //update nickname in user doc
    async UpdateNickName(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { nickname: doc.nickName } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //update avatar code in user doc
    async UpdateAvatar(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { avatarCode: doc.avatarCode, avatarUrl: doc.avatarUrl } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //delete avatar option from avatar array
    async removeAvatarOption(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $pull: { options: { "code": doc.code } } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //add option to avatar option array
    async addAvatarOption(collection, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $push: { options: { code: doc.code, url: doc.url } } });
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }
    //update notification value in user doc
    async UpdateNotifications(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { is_notification: doc.is_notification } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //add play date to user play date array 
    async addPlayDate(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { play_dates: doc } }
            );
        }
        catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }



    //update current level field in user doc
    async UpdateCurrentLevel(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $set: { current_level: doc.current_level } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //update level popolarity in user doc
    async UpdateLevelPopularity(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id), "level_rank.level_code": doc.level_code },
                { $set: { "level_rank.$.popularity": doc.popularity } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //update level rank in user doc
    async UpdateLevelRank(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id), "level_rank.level_code": doc.level_code },
                { $set: { "level_rank.$.rank": doc.rank } });
        } catch (error) {
            console.log(error)
            return error;
        } finally {
            await this.client.close();
        }
    }
    //add level rank to user level rank array 
    async addLevelRank(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: ObjectId(id) },
                { $push: { level_rank: { level_code: doc.level_code, rank: doc.rank, popularity: doc.popularity } } }
            );
        }
        catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

}

module.exports = DB;