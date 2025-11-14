import {
  DeleteResult,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from "mongoose";

export abstract class BaseRepository<T> {
  constructor(private model: Model<T>) {}

  async createNewDocument(document: Partial<T>): Promise<T> {
    return await this.model.create(document);
  }

  async findOneDocument(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
    path?: string | string[]
  ): Promise<T | null> {
    return await this.model
      .findOne(filter, projection, options)
      .populate(path!);
  }

  async findDocuments(
    filter: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ): Promise<T[]> {
    return await this.model.find(filter, projection, options);
  }

  async findDocumentById(
    _id: Types.ObjectId,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    return await this.model.findById(_id, projection, options);
  }

  async updateOneDocument(
    filter: FilterQuery<T>,
    document: UpdateQuery<T>
  ): Promise<Object> {
    return await this.model.updateOne(filter, document);
  }

  async deleteOneDocument(
    filter: FilterQuery<T>
  ): Promise<Object | DeleteResult> {
    return await this.model.deleteOne(filter);
  }

  async FindAndUpdateOrCreate(
    filter: FilterQuery<T>,
    document: Partial<T>,
    options: QueryOptions = {
      upsert: true,
    }
  ) {
    return await this.model.findOneAndUpdate(filter, document, options);
  }

  async deleteManyDocuments(filter: FilterQuery<T>): Promise<Object> {
    return await this.model.deleteMany(filter);
  }
}
