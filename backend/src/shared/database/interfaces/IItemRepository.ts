import {Item, ItemsGroup} from '#courses/classes/transformers/Item.js';
import { UpdateItemBody } from '#root/modules/courses/classes/index.js';
import {ClientSession, ObjectId} from 'mongodb';

export interface IItemRepository {
  readItem(
    courseVersionId: string,
    itemId: string,
    session?: ClientSession,
  ): Promise<Item | null>;

  deleteItem(
    itemGroupsId: string,
    itemId: string,
    session?: ClientSession,
  ): Promise<ItemsGroup | null>;

  createItemsGroup(
    itemsGroup: ItemsGroup,
    session?: ClientSession,
  ): Promise<ItemsGroup | null>;

  readItemsGroup(
    itemsGroupId: string,
    session?: ClientSession,
  ): Promise<ItemsGroup | null>;

  updateItemsGroup(
    itemsGroupId: string,
    itemsGroup: ItemsGroup,
    session?: ClientSession,
  ): Promise<ItemsGroup | null>;

  updateItem(
    itemId: string,
    item: UpdateItemBody,
    session?: ClientSession
  ): Promise<Item>

  findItemsGroupByItemId(
    itemId: string,
    session?: ClientSession,
  ): Promise<ItemsGroup | null>;

  getFirstOrderItems(
    courseVersionId: string,
    session?: ClientSession,
  ): Promise<{
    moduleId: ObjectId;
    sectionId: ObjectId;
    itemId: ObjectId;
  }>;

  createItem(item: Item, session?: ClientSession): Promise<Item | null>;
  CalculateTotalItemsCount(courseId: string, versionId: string, session?: ClientSession): Promise<number>;
  getTotalItemsCount(
    courseId: string,
    versionId: string,
    session?: ClientSession,
  ): Promise<number>;
  // createVideoDetails(details: IVideoDetails): Promise<string>;
  // createQuizDetails(details: IQuizDetails): Promise<string>;
  // createBlogDetails(details: IBlogDetails): Promise<string>;

  // readVideoDetails(detailsId: string): Promise<IVideoDetails | null>;
  // readQuizDetails(detailsId: string): Promise<IQuizDetails | null>;
  // readBlogDetails(detailsId: string): Promise<IBlogDetails | null>;
}
