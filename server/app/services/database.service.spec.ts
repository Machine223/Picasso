import { expect } from 'chai';
import { Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Drawing } from '../../../common/communication/drawing';
import { DatabaseService } from './database.service';

const DATABASE_NAME = 'Database';
const DATABASE_COLLECTION = 'SavedDrawings';
const MOCK_DRAWING: Drawing = { name: 'test', tags: [], metadata: '', previewSource: ''};
const INVALID_DRAWING: Drawing = { name: 'invalid', tags: ['$nope'], metadata: '', previewSource: '' };

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;
let databaseService: DatabaseService;
let collection: Collection<Drawing>;

beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
        // Source: Antoine Morcel, fellow student of info-log
    MongoClient.connect(mongoUri, (err, client) => {
            mongoClient = client;
            collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        });
    databaseService = new DatabaseService();
    databaseService.collection = collection;
});

after(async () => {
    await mongoClient.close();
    await mongoServer.stop();
});

describe('DatabaseService', () => {
    it('#addDrawing should add exactly one Drawing to collection if said Drawing is valid', async () => {
        databaseService.addDrawing(MOCK_DRAWING);
        return databaseService.getAllDrawings().then((result: Drawing[]) => {
            return expect(result.length).to.equals(1);
        });
    });

    it('#addDrawing should not add Drawing to collection if said Drawing is invalid', async () => {
        databaseService.addDrawing(INVALID_DRAWING);
        return databaseService.getAllDrawings().then((result: Drawing[]) => {
            return expect(result.length).to.equals(0);
        });
    });

    it('#deleteDrawing should delete exactly one Drawing to collection', async () => {
        databaseService.addDrawing(MOCK_DRAWING);
        databaseService.deleteDrawing(MOCK_DRAWING.name);
        return databaseService.getAllDrawings().then((result: Drawing[]) => {
            return expect(result.length).to.equals(0);
        });
    });

    it('#updateDrawing should modify a Drawing\'s information', async () => {
        databaseService.addDrawing(MOCK_DRAWING);
        const modifiedDrawing: Drawing = { name: 'modified', tags: [], metadata: '', previewSource: ''};
        databaseService.updateDrawing([modifiedDrawing, MOCK_DRAWING]);
        return databaseService.getAllDrawings().then((result: Drawing[]) => {
            return expect(result[0].name).to.equals(modifiedDrawing.name);
        });
    });

    it('#validateTags should return true if tag starts with a lowercase', () => {
        return expect(databaseService.validateTags(['hello'])).to.equals(true);
    });

    it('#validateTags should return true if tag starts with an uppercase', () => {
        return expect(databaseService.validateTags(['World'])).to.equals(true);
    });

    it('#validateTags should return false if tag does not start with a letter', () => {
        return expect(databaseService.validateTags(['$symbol'])).to.equals(false);
    });
});
