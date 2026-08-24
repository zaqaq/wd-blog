export type Article = {
  id: number
  tag: string | null
  title: string
  des: string | null
  publish_date: string
  comment_count: number
  content?: string
  read_count: number
  praise_count: number
  img_href?: string | null
}

export type ArticleNeighbor = {
  id?: number
  title?: string
  flag: boolean
}

export type ArticleListResponse = {
  totalNum: number
  articleList: Article[]
}

export type ArticleDetailResponse = {
  articleDetail: Article
  next: ArticleNeighbor
  prev: ArticleNeighbor
  praise?: { praised: boolean }
}

export type CommentReply = {
  id: number
  nickname: string
  content: string
  reply_to_nickname: string | null
  created_at: string
}

export type Comment = CommentReply & {
  replies: CommentReply[]
}

export type CommentListResponse = {
  totalNum: number
  commentList: Comment[]
}

export type CommentAddResponse = CommentReply & {
  status: 'published' | 'pending' | 'hidden'
}

export type PraiseToggleResponse = {
  praised: boolean
  praise_count: number
}

export type NavItem = {
  nav_id: number
  title: string
}

export type HeaderNav = NavItem & {
  sub_title: NavItem[]
}

export type AdminNavItem = {
  id: number
  parent_id: number
  nav_id: number
  title: string
}

export type AdminNavListResponse = {
  navList: AdminNavItem[]
}

export type SideBarArticle = {
  id: number
  title: string
  publish_date?: string
  read_count?: number
}

export type HotTag = {
  tag: string
  nav_id: number
  count: number
}

export type SideBarResponse = {
  intro: string
  notice: string
  updateList: SideBarArticle[]
  rankList: SideBarArticle[]
  hotsTagList: HotTag[]
}

export type SiteProfileResponse = {
  intro: string
  notice: string
  updated_at: string
}

export type UpdateReadResponse = {
  code: boolean
}

export type AdminUser = {
  id: number
  username: string
}

export type LoginResponse = {
  token: string
  user: AdminUser
}

export type PublishArticleInput = {
  title: string
  des: string
  content: string
  tag: string
  nav_id: number
  img_href?: string
}

export type PublishArticleResponse = {
  id: number
  title: string
  des: string
  tag: string
  nav_id: number
  img_href?: string | null
  publish_date: string
}

export type AdminArticle = {
  id: number
  title: string
  des: string | null
  tag: string | null
  nav_id: number
  img_href: string | null
  publish_date: string
  comment_count: number
  read_count: number
  praise_count: number
  updated_at: string
}

export type AdminArticleDetail = AdminArticle & {
  content: string
}

export type AdminArticleListResponse = {
  totalNum: number
  articleList: AdminArticle[]
}
