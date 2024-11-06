import { generateQuery } from '../generateQuery';
import { getAST, queryWizardLabel } from '../queryWizard';

describe('userInput -> query works', () => {
  it('should work for simple queries', () => {
    expect(generateQuery(getAST('amenity=bench'))).toBe(
      'nwr["amenity"="bench"]',
    );
    expect(generateQuery(getAST('amenity=*'))).toBe('nwr["amenity"]');
    expect(generateQuery(getAST('"amenity"="*"'))).toBe('nwr["amenity"="*"]');
    expect(generateQuery(getAST('"name"    = "multiple words =)"'))).toBe(
      'nwr["name"="multiple words =)"]',
    );
    expect(generateQuery(getAST('   diet:vegan=no '))).toBe(
      'nwr["diet:vegan"="no"]',
    );
  });

  it('should work for more complex queries', () => {
    expect(generateQuery(getAST('tourism=museum and fee = no'))).toBe(
      'nwr["tourism"="museum"]["fee"="no"]',
    );
    expect(generateQuery(getAST('amenity=restaurant or amenity = cafe'))).toBe(
      'nwr["amenity"="restaurant"];nwr["amenity"="cafe"]',
    );

    expect(
      generateQuery(getAST('tourism=museum and fee = no and museum=art')),
    ).toBe('nwr["tourism"="museum"]["fee"="no"]["museum"="art"]');
    expect(
      generateQuery(
        getAST('amenity=restaurant or amenity = cafe or historic=*'),
      ),
    ).toBe('nwr["amenity"="restaurant"];nwr["amenity"="cafe"];nwr["historic"]');
  });

  it('should work with groups', () => {
    expect(
      generateQuery(
        getAST(
          '(tourism=museum and fee = no) or (historic=castle and wikipedia=*)',
        ),
      ),
    ).toBe(
      'nwr["tourism"="museum"]["fee"="no"];nwr["historic"="castle"]["wikipedia"]',
    );

    expect(
      generateQuery(
        getAST(
          '(tourism=museum or natural = tree) and (building=yes or height=*)',
        ),
      ),
    ).toBe(
      'nwr["tourism"="museum"]["building"="yes"];nwr["tourism"="museum"]["height"];nwr["natural"="tree"]["building"="yes"];nwr["natural"="tree"]["height"]',
    );
  });

  it('should not work with invalid userInput', () => {
    expect(() => generateQuery(getAST('amenity'))).toThrow(Error);
    expect(() => generateQuery(getAST('amenity='))).toThrow(Error);
    expect(() => generateQuery(getAST('amenity=* and'))).toThrow(Error);
    expect(() =>
      generateQuery(getAST('amenity=* and historic=* or natural=*')),
    ).toThrow(Error);
    expect(() => generateQuery(getAST('amenity=|*'))).toThrow(Error);
  });
});

test('userInput (ast) -> label works', () => {
  expect(queryWizardLabel(getAST('amenity=*'))).toBe('amenity=*');
  expect(queryWizardLabel(getAST('amenity=bench'))).toBe('amenity=bench');
  expect(queryWizardLabel(getAST('amenity=bench or speed_limit=30'))).toBe(
    'amenity=bench or 1 other',
  );
  expect(queryWizardLabel(getAST('amenity=bench and material=wood'))).toBe(
    'amenity=bench and 1 other',
  );
  expect(
    queryWizardLabel(
      getAST('(amenity=bench or aeroway=runway) and wikipedia=*'),
    ),
  ).toBe('2 with and combined expressions');
  expect(queryWizardLabel(getAST('(amenity=bench or aeroway=runway)'))).toBe(
    'amenity=bench or 1 other',
  );
});
