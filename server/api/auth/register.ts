import { defineEventHandler, readBody, sendError, createError } from 'h3';
import prisma from '../../../lib/prisma';
import * as bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    return sendError(event, createError({ statusCode: 405, statusMessage: 'Metodo non consentito' }));
  }

  const { email, password } = await readBody(event);

  if (!email || !password) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Email e password sono richieste' }));
  }

  // Controlla se l'utente esiste già
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'L\'utente esiste già' }));
  }

  // Hash della password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crea il nuovo utente
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      credits: 30,
    },
  });

  return { statusCode: 200 };
});
