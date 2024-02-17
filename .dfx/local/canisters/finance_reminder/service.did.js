export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'authenticate' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'money' : IDL.Int32,
            'listTransactionsid' : IDL.Vec(IDL.Text),
            'name' : IDL.Text,
          }),
        ],
        [],
      ),
    'createTransaction' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Int32, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'getUserTransactions' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'foreign_user_id' : IDL.Text,
              'user' : IDL.Text,
              'description' : IDL.Text,
              'amount' : IDL.Int32,
            })
          ),
        ],
        ['query'],
      ),
    'topupMoney' : IDL.Func(
        [IDL.Text, IDL.Int32],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'money' : IDL.Int32,
              'listTransactionsid' : IDL.Vec(IDL.Text),
              'name' : IDL.Text,
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
