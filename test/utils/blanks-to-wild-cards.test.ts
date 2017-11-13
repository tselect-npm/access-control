import { blanksToWildCards, WILD_CARD } from '../../';

describe('blanksToWildCards()', () => {
  it('should replace empty slots by wild cards', () => {
    expect(blanksToWildCards(['1', '2', '3'], 6)).to.deep.equal(['1', '2', '3', WILD_CARD, WILD_CARD, WILD_CARD]);
  });
});