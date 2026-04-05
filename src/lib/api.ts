import { client } from './insforge'

export interface Request {
  id: string
  user_id: string
  title: string
  category: string
  description: string
  quantity: number
  budget_per_unit: number | null
  currency: string
  status: string
  quoted_price: number | null
  tracking_number: string | null
  estimated_delivery: string | null
  admin_notes: string | null
  client_notes: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  request_id: string
  user_id: string
  content: string
  sender_role: string
  created_at: string
}

export const requestsApi = {
  async getAll(): Promise<Request[]> {
    const { data, error } = await client.database.from('requests').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getByUserId(userId: string): Promise<Request[]> {
    const { data, error } = await client.database.from('requests').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async updateClientNotes(id: string, notes: string): Promise<Request> {
    const { data, error } = await client.database.from('requests').update({ client_notes: notes, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async getById(id: string): Promise<Request | null> {
    const { data, error } = await client.database.from('requests').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async create(request: {
    title: string
    category: string
    description: string
    quantity: number
    budget_per_unit?: number
    currency: string
  }): Promise<Request> {
    const { data, error } = await client.database.from('requests').insert(request).select().single()
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: string): Promise<Request> {
    const { data, error } = await client.database.from('requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  }
}

export const messagesApi = {
  async getByRequestId(requestId: string): Promise<Message[]> {
    const { data, error } = await client.database.from('messages').select('*').eq('request_id', requestId).order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async create(message: {
    request_id: string
    content: string
    sender_role: string
  }): Promise<Message> {
    const { data, error } = await client.database.from('messages').insert(message).select().single()
    if (error) throw error
    return data
  }
}

export interface Quote {
  id: string
  request_id: string
  price_per_unit: number
  currency: string
  notes: string | null
  status: string
  created_at: string
  updated_at: string
}

export const quotesApi = {
  async getByRequestId(requestId: string): Promise<Quote[]> {
    const { data, error } = await client.database.from('quotes').select('*').eq('request_id', requestId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async create(quote: {
    request_id: string
    price_per_unit: number
    currency: string
    notes?: string
  }): Promise<Quote> {
    const { data, error } = await client.database.from('quotes').insert(quote).select().single()
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: string): Promise<Quote> {
    const { data, error } = await client.database.from('quotes').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async acceptQuote(quoteId: string, requestId: string): Promise<void> {
    const { error: err1 } = await client.database.from('quotes').update({ status: 'accepted', updated_at: new Date().toISOString() }).eq('id', quoteId)
    if (err1) throw err1
    
    const quote = await this.getById(quoteId)
    if (quote) {
      const { error: err2 } = await client.database.from('requests').update({ 
        status: 'confirmed', 
        quoted_price: quote.price_per_unit,
        updated_at: new Date().toISOString() 
      }).eq('id', requestId)
      if (err2) throw err2
    }
  },

  async getById(id: string): Promise<Quote | null> {
    const { data, error } = await client.database.from('quotes').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async rejectQuote(id: string): Promise<Quote> {
    const { data, error } = await client.database.from('quotes').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  }
}

export interface ActivityLog {
  id: string
  request_id: string
  user_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
}

export const activityLogsApi = {
  async getByRequestId(requestId: string): Promise<ActivityLog[]> {
    const { data, error } = await client.database.from('activity_logs').select('*').eq('request_id', requestId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async create(log: {
    request_id: string
    user_id?: string
    action: string
    details?: Record<string, unknown>
  }): Promise<ActivityLog> {
    const { data, error } = await client.database.from('activity_logs').insert({
      request_id: log.request_id,
      user_id: log.user_id || null,
      action: log.action,
      details: log.details || {}
    }).select().single()
    if (error) throw error
    return data
  }
}

export interface TrendingProduct {
  id: string
  name: string
  description: string | null
  image_url: string | null
  image_url_2: string | null
  image_url_3: string | null
  image_url_4: string | null
  category: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export const trendingProductsApi = {
  async getAll(): Promise<TrendingProduct[]> {
    const { data, error } = await client.database.from('trending_products').select('*').order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getActive(): Promise<TrendingProduct[]> {
    const { data, error } = await client.database.from('trending_products').select('*').eq('is_active', true).order('display_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async create(product: {
    name: string
    description?: string
    image_url?: string
    image_url_2?: string
    image_url_3?: string
    image_url_4?: string
    category?: string
    display_order?: number
  }): Promise<TrendingProduct> {
    const { data, error } = await client.database.from('trending_products').insert({
      ...product,
      is_active: true,
      display_order: product.display_order || 0
    }).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, product: Partial<{
    name: string
    description: string
    image_url: string
    image_url_2: string
    image_url_3: string
    image_url_4: string
    category: string
    display_order: number
    is_active: boolean
  }>): Promise<TrendingProduct> {
    const { data, error } = await client.database.from('trending_products').update(product).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await client.database.from('trending_products').delete().eq('id', id)
    if (error) throw error
  },

  async reorder(products: { id: string; display_order: number }[]): Promise<void> {
    for (const p of products) {
      const { error } = await client.database.from('trending_products').update({ display_order: p.display_order }).eq('id', p.id)
      if (error) throw error
    }
  }
}

export interface NewsPost {
  id: string
  title: string
  content: string
  category: 'new_arrivals' | 'shipping' | 'market'
  published_at: string
  is_active: boolean
  created_at: string
}

export const newsPostsApi = {
  async getAll(): Promise<NewsPost[]> {
    const { data, error } = await client.database.from('news_posts').select('*').order('published_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getActive(limit = 5): Promise<NewsPost[]> {
    const { data, error } = await client.database.from('news_posts').select('*').eq('is_active', true).order('published_at', { ascending: false }).limit(limit)
    if (error) throw error
    return data || []
  },

  async create(post: {
    title: string
    content: string
    category: 'new_arrivals' | 'shipping' | 'market'
    published_at?: string
  }): Promise<NewsPost> {
    const { data, error } = await client.database.from('news_posts').insert({
      ...post,
      is_active: true,
      published_at: post.published_at || new Date().toISOString()
    }).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, post: Partial<{
    title: string
    content: string
    category: 'new_arrivals' | 'shipping' | 'market'
    published_at: string
    is_active: boolean
  }>): Promise<NewsPost> {
    const { data, error } = await client.database.from('news_posts').update(post).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await client.database.from('news_posts').delete().eq('id', id)
    if (error) throw error
  }
}
