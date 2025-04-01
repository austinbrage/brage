import { z } from 'zod';

export class ArticlesValidation {

   schema = z.object({
      id: z.number(),
      user_id: z.number(),
      name: z.string(),
      title: z.string(),
      keywords: z.string(),
      description: z.string(),
      image: z.union([z.string(), z.null()]),
      is_publish: z.boolean(),
      created_at: z.union([z.date(), z.null()]),
      updated_at: z.union([z.date(), z.null()]),
   })

   getAllById = (data) => this.schema.pick({ user_id: true }).safeParse(data)
   getAllByName = (data) => this.schema.pick({ name: true }).safeParse(data)
   getId = (data) => this.schema.pick({ user_id: true, name: true }).safeParse(data)
   addNew = (data) => this.schema.pick({ user_id: true, name: true, title: true, image: true, keywords: true, description: true }).safeParse(data)
   changeData = (data) => this.schema.pick({ name: true, title: true, image: true, keywords: true, description: true, id: true }).safeParse(data)
   changePublishment = (data) => this.schema.pick({ is_publish: true, id: true }).safeParse(data)
   remove = (data) => this.schema.pick({ id: true }).safeParse(data)
}

export class ArticlesStringValidation {

   schema = z.object({
      id: z.string(),
      user_id: z.string(),
      name: z.string(),
      title: z.string(),
      keywords: z.string(),
      description: z.string(),
      image: z.string(),
      is_publish: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
   })

   getAllById = (data) => this.schema.pick({ user_id: true }).safeParse(data)
   getAllByName = (data) => this.schema.pick({ name: true }).safeParse(data)
   getId = (data) => this.schema.pick({ user_id: true, name: true }).safeParse(data)
}