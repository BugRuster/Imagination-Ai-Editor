// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { WebhookEvent } from '@clerk/nextjs/server';
// import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   // Add CORS headers
//   const corsHeaders = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'POST,OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Svix-Id, Svix-Timestamp, Svix-Signature',
//   };

//   // Handle OPTIONS request
//   if (req.method === 'OPTIONS') {
//     return new Response(null, {
//       headers: corsHeaders,
//       status: 200,
//     });
//   }

//   try {
//     // Get the headers
//     const headerPayload = headers();
//     const svix_id = headerPayload.get("svix-id");
//     const svix_timestamp = headerPayload.get("svix-timestamp");
//     const svix_signature = headerPayload.get("svix-signature");

//     if (!svix_id || !svix_timestamp || !svix_signature) {
//       return new Response(
//         JSON.stringify({
//           error: 'Missing svix headers',
//           headers: {
//             'svix-id': svix_id,
//             'svix-timestamp': svix_timestamp,
//             'svix-signature': svix_signature,
//           },
//         }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     if (!process.env.CLERK_WEBHOOK_SECRET) {
//       return new Response(
//         JSON.stringify({ error: 'Missing CLERK_WEBHOOK_SECRET' }),
//         { status: 500, headers: corsHeaders }
//       );
//     }

//     const payload = await req.json();
//     const body = JSON.stringify(payload);

//     const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     let evt: WebhookEvent;

//     try {
//       evt = wh.verify(body, {
//         "svix-id": svix_id,
//         "svix-timestamp": svix_timestamp,
//         "svix-signature": svix_signature,
//       }) as WebhookEvent;
//     } catch (err) {
//       return new Response(
//         JSON.stringify({ error: 'Error verifying webhook', details: err }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const eventType = evt.type;

//     if (eventType === 'user.created') {
//       const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

//       const user = {
//         clerkId: id,
//         email: email_addresses[0].email_address,
//         username: username || email_addresses[0].email_address.split('@')[0],
//         firstName: first_name || '',
//         lastName: last_name || '',
//         photo: image_url || `https://ui-avatars.com/api/?name=${first_name}+${last_name}`,
//       };

//       try {
//         const newUser = await createUser(user);
//         return NextResponse.json(
//           { message: 'User created', user: newUser },
//           { headers: corsHeaders }
//         );
//       } catch (error) {
//         return new Response(
//           JSON.stringify({ error: 'Error creating user', details: error }),
//           { status: 500, headers: corsHeaders }
//         );
//       }
//     }

//     if (eventType === 'user.updated') {
//       const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

//       const user = {
//         email: email_addresses[0].email_address,
//         username: username || email_addresses[0].email_address.split('@')[0],
//         firstName: first_name || '',
//         lastName: last_name || '',
//         photo: image_url || `https://ui-avatars.com/api/?name=${first_name}+${last_name}`,
//       };

//       try {
//         const updatedUser = await updateUser(id, user);
//         return NextResponse.json(
//           { message: 'User updated', user: updatedUser },
//           { headers: corsHeaders }
//         );
//       } catch (error) {
//         return new Response(
//           JSON.stringify({ error: 'Error updating user', details: error }),
//           { status: 500, headers: corsHeaders }
//         );
//       }
//     }

//     if (eventType === 'user.deleted') {
//       const { id } = evt.data;

//       try {
//         const deletedUser = await deleteUser(id!);
//         return NextResponse.json(
//           { message: 'User deleted', user: deletedUser },
//           { headers: corsHeaders }
//         );
//       } catch (error) {
//         return new Response(
//           JSON.stringify({ error: 'Error deleting user', details: error }),
//           { status: 500, headers: corsHeaders }
//         );
//       }
//     }

//     return NextResponse.json(
//       { message: 'Webhook processed', type: eventType },
//       { headers: corsHeaders }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: 'Internal server error', details: error }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// export async function OPTIONS() {
//   return new Response(null, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST,OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Svix-Id, Svix-Timestamp, Svix-Signature',
//     },
//   });
// }