import { describe, it, expect } from 'vitest';
import mapRelations, { cleanAndSortRelations, processNestedRelations } from '../map-relations';

describe('mapRelations', () => {
  it('should map simple relations', () => {
    const relations = ['posts', 'comments', 'likes'];
    const result = mapRelations(relations);
    expect(result).toEqual({
      posts: true,
      comments: true,
      likes: true
    });
  });

  it('should map nested relations', () => {
    const relations = ['posts.author', 'comments.post'];
    const result = mapRelations(relations);
    expect(result).toEqual({
      posts: {
        include: {
          author: true
        }
      },
      comments: {
        include: {
          post: true
        }
      }
    });
  });

  it('should map deeply nested relations', () => {
    const relations = ['posts.comments.author', 'posts.likes.user'];
    const result = mapRelations(relations);
    expect(result).toEqual({
      posts: {
        include: {
          comments: {
            include: {
              author: true
            }
          },
          likes: {
            include: {
              user: true
            }
          }
        }
      }
    });
  });

  it('should handle followers/following relations', () => {
    const relations = ['followers.follower', 'following.following'];
    const result = mapRelations(relations);
    expect(result).toEqual({
      followers: {
        include: {
          follower: true
        }
      },
      following: {
        include: {
          following: true
        }
      }
    });
  });

  it('should handle mixed simple and nested relations', () => {
    const relations = ['posts', 'comments.author', 'likes'];
    const result = mapRelations(relations);
    expect(result).toEqual({
      posts: true,
      comments: {
        include: {
          author: true
        }
      },
      likes: true
    });
  });

  it('should handle multiple nested relations at same level', () => {
    const relations = ['posts.author.followers', 'posts.author.following'];
    const result = mapRelations(relations);
    expect(result).toEqual({
      posts: {
        include: {
          author: {
            include: {
              followers: true,
              following: true
            }
          }
        }
      }
    });
  });

  it('should throw error for invalid input', () => {
    expect(() => mapRelations([] as any)).toThrow('Relations must be an array of strings.');
    expect(() => mapRelations(null as any)).toThrow('Relations must be an array of strings.');
    expect(() => mapRelations(undefined as any)).toThrow('Relations must be an array of strings.');
    expect(() => mapRelations([1, 2, 3] as any)).toThrow('Relations must be an array of strings.');
  });
});

describe('cleanAndSortRelations', () => {
  it('should clean and sort relations', () => {
    const relations = [' posts ', 'comments  ', '', '  likes'];
    const result = cleanAndSortRelations(relations);
    expect(result).toEqual(['comments', 'likes', 'posts']);
  });

  it('should handle invalid inputs', () => {
    expect(cleanAndSortRelations([])).toEqual([]);
    expect(cleanAndSortRelations(['   ', ''])).toEqual([]);
  });

  it('should maintain order when shouldSort is false', () => {
    const relations = ['posts', 'comments', 'likes'];
    const result = cleanAndSortRelations(relations, false);
    expect(result).toEqual(['posts', 'comments', 'likes']);
  });
});

describe('processNestedRelations', () => {
  it('should process nested relations correctly', () => {
    const result = {};
    processNestedRelations(result, ['posts', 'comments', 'author']);
    expect(result).toEqual({
      posts: {
        include: {
          comments: {
            include: {
              author: true
            }
          }
        }
      }
    });
  });

  it('should handle empty relations array', () => {
    const result = {};
    processNestedRelations(result, []);
    expect(result).toEqual({});
  });

  it('should handle conversion from boolean to object when needed', () => {
    const result = { posts: true };
    processNestedRelations(result, ['posts', 'comments']);
    expect(result).toEqual({
      posts: {
        include: {
          comments: true
        }
      }
    });
  });

  it('should handle multiple nested paths with same prefix', () => {
    const result = {};
    processNestedRelations(result, ['posts', 'comments']);
    processNestedRelations(result, ['posts', 'likes']);
    expect(result).toEqual({
      posts: {
        include: {
          comments: true,
          likes: true
        }
      }
    });
  });
});
