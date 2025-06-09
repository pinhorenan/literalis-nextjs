import { withAuth } from 'next-auth/middleware'

export default withAuth({
  // Aqui você pode customizar callbacks e páginas, se quiser
  callbacks: {
    authorized({ token }) {
      // só autoriza quem tiver token válido
      return Boolean(token)
    },
  },
  pages: {
    signIn: '/login',      // rota para a página de login
    error:  '/auth/error', // rota de erro (opcional)
  },
})

export const config = {
  matcher: [
    // protege todas as APIs…
    '/api/:path*',
    // …exceto auth (login/logout) e cadastro de usuário
    '!/api/auth/:path*',
    '!/api/users',
    // você também pode proteger rotas de front (se tiver)
    // '/app/:path*',
  ],
}
