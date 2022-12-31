import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
import { Collection, Db, FilterQuery, MongoClient, MongoClientOptions, UpdateQuery } from 'mongodb';
import 'reflect-metadata';
import { Drawing } from '../../../common/communication/drawing';

const DATABASE_NAME = 'Database';
const DATABASE_COLLECTION = 'SavedDrawings';

// Source: Most of this code is inspired of the MongoDB tutorial, provided on Moodle

@injectable()
export class DatabaseService {

  collection: Collection<Drawing>;

  private options: MongoClientOptions = {
    useNewUrlParser : true,
    useUnifiedTopology : true
  };

  constructor() {
    dotenv.config();
    MongoClient.connect(process.env.DATABASE_URL as string, this.options)
    .then((client: MongoClient) => {
      this.setClient(client.db(DATABASE_NAME));
    })
    .catch(() => {
      console.error('CONNECTION ERROR. EXITING PROCESS');
      process.exit(1);
    });
  }

  setClient(inputDatabase: Db): void {
    this.collection = inputDatabase.collection(DATABASE_COLLECTION);
  }

  async getAllDrawings(): Promise<Drawing[]> {
    return  this.collection.find({}).toArray()
    .then((drawings: Drawing[]) => {
      return drawings;
    });
  }

  async addDrawing(drawing: Drawing): Promise<void> {
    if (this.validateDrawing(drawing)) {
      this.collection.insertOne(drawing);
    } else {
      throw new Error('Invalid drawing');
    }
  }

  async deleteDrawing(inputName: string): Promise<void> {
    inputName = inputName.replace(':', '');
    await this.collection.findOneAndDelete({ name: inputName })
    .then(() => { return; });
  }

  async updateDrawing(drawings: Drawing[]): Promise<void> {
    const newDrawing = drawings[0];
    const oldDrawing = drawings[1];
    const filterQuery: FilterQuery<Drawing> = { name: oldDrawing.name,
                                                tags: oldDrawing.tags,
                                                metadata: oldDrawing.metadata,
                                                previewSource: oldDrawing.previewSource};
    const updateQuery: UpdateQuery<Drawing> = {
      $set : {
        name : newDrawing.name,
        tags: newDrawing.tags,
        metadata: newDrawing.metadata,
        previewSource: newDrawing.previewSource
      },
    };
    this.collection.updateOne(filterQuery, updateQuery)
    .then(() => { return; });
  }

  validateDrawing(drawing: Drawing): boolean {
    return this.validateName(drawing.name) && this.validateTags(drawing.tags);
  }

  validateName(name: string): boolean {
    return name !== undefined;
  }

  validateTags(tags: string[]): boolean {
    for (const tag of tags) {
      const firstChar = tag.substr(0, 1).charCodeAt(0);
      if (!(this.isALowercase(firstChar) || this.isAnUppercase(firstChar))) {
        return false;
      }
    }
    return true;
  }

  isALowercase(charCode: number): boolean {
    return (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0));
  }

  isAnUppercase(charCode: number): boolean {
    return (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0));
  }
}
