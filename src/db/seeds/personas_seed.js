/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('personas').del()
  await knex('personas').insert([
    {id: 1, apellidos: 'dfgasrg', nombres: 'hugo', telefono: '324234234', email: 'ewerefaf', direccion: 'cerg'},
    {id: 2, apellidos: 'dfgasryuuuyg', nombres: 'paco', telefono: '456464564', email: 'thrthrth', direccion: 'gfgdfgd'},
    {id: 3, apellidos: 'eeeer', nombres: 'reeee', telefono: '789789789', email: 'htsrhtsr', direccion: 'greg'},
  ]);
};
