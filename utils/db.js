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
}

module.exports = DB;