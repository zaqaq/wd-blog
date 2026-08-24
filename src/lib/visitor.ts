const VISITOR_KEY = 'wd-blog-visitor-id'
const NICKNAME_KEY = 'wd-blog-nickname'

function createVisitorId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

export function getVisitorId() {
  if (typeof localStorage === 'undefined') {
    return createVisitorId()
  }

  let id = localStorage.getItem(VISITOR_KEY)
  if (!id || !/^[a-zA-Z0-9_-]{8,64}$/.test(id)) {
    id = createVisitorId()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export function getStoredNickname() {
  if (typeof localStorage === 'undefined') {
    return ''
  }
  return localStorage.getItem(NICKNAME_KEY) ?? ''
}

export function setStoredNickname(nickname: string) {
  if (typeof localStorage === 'undefined') {
    return
  }
  localStorage.setItem(NICKNAME_KEY, nickname)
}
