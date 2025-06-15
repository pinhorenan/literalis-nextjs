// File: prisma/seed.ts
import { PrismaClient, NotificationType, AccountType } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';

const prisma = new PrismaClient();

const NUM_USERS = 10;
const NUM_BOOKS = 20;
const MAX_BOOKS_PER_SHELF = 15;
const MAX_FOLLOWS_PER_USER = 8;
const MAX_POSTS_PER_USER = 6;
const MAX_COMMENTS_PER_POST = 8;
const MAX_LIKES_PER_POST = 9;

async function main() {
  // ─── 1. Usuários ──────────────────────────────────────────────────────────
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const username = faker.internet.userName().toLowerCase();
    const email = `${username}@literalis.com`;
    const bio = faker.lorem.sentences(3);
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        bio,
        password: 'password',
        role: AccountType.USER,
      },
    });
    users.push(user);
  }

  // ─── 2. Livros ────────────────────────────────────────────────────────────
  const books = [];
  for (let i = 0; i < NUM_BOOKS; i++) {
    const isbn = faker.string.numeric(10);
    const title = faker.lorem.words(2);
    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const edition = faker.number.int({ min: 1, max: 5 });
    const pages = faker.number.int({ min: 100, max: 1200 });
    const publicationDate = faker.date.past({ years: 10 });

    const book = await prisma.book.create({
      data: {
        isbn,
        title,
        author,
        publisher,
        edition,
        pages,
        language: 'Português',
        publicationDate,
      },
    });
    books.push(book);
  }

  // ─── 3. Estantes (UserBook) ───────────────────────────────────────────────
  for (const user of users) {
    const numBooks = faker.number.int({ min: 5, max: MAX_BOOKS_PER_SHELF });
    const shuffled = faker.helpers.shuffle(books);
    for (let i = 0; i < numBooks; i++) {
      await prisma.userBook.create({
        data: {
          userUsername: user.username,
          bookIsbn: shuffled[i].isbn,
          progress: faker.number.int({ min: 0, max: 100 }),
        },
      });
    }
  }

  // ─── 4. Follows + Notificações de follow ──────────────────────────────────
  for (const follower of users) {
    const possible = users.filter(u => u.username !== follower.username);
    const toFollow = faker.helpers.shuffle(possible).slice(0, MAX_FOLLOWS_PER_USER);

    for (const followed of toFollow) {
      await prisma.follow.create({
        data: {
          followerId: follower.username,
          followedId: followed.username,
        },
      });
      await prisma.notification.create({
        data: {
          notifType: NotificationType.FOLLOW,
          actorId: follower.username,
          recipientId: followed.username,
        },
      });
    }
  }

  // ─── 5. Posts, Comments, Likes + Notificações ─────────────────────────────
  for (const author of users) {
    const numPosts = faker.number.int({ min: 1, max: MAX_POSTS_PER_USER });
    for (let p = 0; p < numPosts; p++) {
      const book = faker.helpers.arrayElement(books);
      const post = await prisma.post.create({
        data: {
          authorUsername: author.username,
          bookIsbn: book.isbn,
          excerpt: faker.lorem.paragraph(),
          progress: faker.number.int({ min: 0, max: 100 }),
        },
      });

      // Comentários + notificações
      const numComments = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST });
      for (let c = 0; c < numComments; c++) {
        const commenter = faker.helpers.arrayElement(users);
        await prisma.comment.create({
          data: {
            postId: post.id,
            authorUsername: commenter.username,
            content: faker.lorem.sentence(),
          },
        });
        await prisma.notification.create({
          data: {
            notifType: NotificationType.COMMENT,
            actorId: commenter.username,
            recipientId: author.username,
            postId: post.id,
          },
        });
      }

      // Likes + notificações
      const shuffled = faker.helpers.shuffle(users);
      const numLikes = faker.number.int({ min: 0, max: MAX_LIKES_PER_POST });
      for (let l = 0; l < numLikes; l++) {
        const liker = shuffled[l];
        try {
          await prisma.like.create({
            data: {
              postId: post.id,
              userUsername: liker.username,
            },
          });
          await prisma.notification.create({
            data: {
              notifType: NotificationType.LIKE,
              actorId: liker.username,
              recipientId: author.username,
              postId: post.id,
            },
          });
        } catch {
          // já curtiu, ignora
        }
      }
    }
  }

  console.log('✅ Database seeded com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
