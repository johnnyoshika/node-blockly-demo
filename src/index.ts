import 'dotenv/config';
import express from 'express';
const app = express();
import Blockly from 'blockly';
import xml2js from 'xml2js';

const xmlText = `<xml
xmlns="https://developers.google.com/blockly/xml">
<variables>
  <variable id="zHLK1pJ)ha4:E*Un1gv_">firstDayOfMonth</variable>
  <variable id="fZ3m*9T$0:_Q*D93f0zb">thirdDayOfMonth</variable>
  <variable id="e.).9(qlkLl^TxBJkcQX">secondDayOfMonth</variable>
</variables>
<block type="variables_set" id="#/*2lF}W$myJK706(T;k" x="41" y="89">
  <field name="VAR" id="zHLK1pJ)ha4:E*Un1gv_">firstDayOfMonth</field>
  <value name="VALUE">
    <block type="math_random_int" id="yB4p9DO};/XgdVUir+(S">
      <value name="FROM">
        <shadow type="math_number" id="2Yds56HXN$2qUgiCE.rh">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number" id=";.yRd8d9Wa#3M8@{~@7*">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </value>
  <next>
    <block type="variables_set" id="5RkUuq]]ftwf6cF!cF|l">
      <field name="VAR" id="fZ3m*9T$0:_Q*D93f0zb">thirdDayOfMonth</field>
      <value name="VALUE">
        <block type="math_random_int" id="+XbOy8:494dBsfz16!WV">
          <value name="FROM">
            <shadow type="math_number" id="ywxZ1K/ZU7vVHikBRN{g">
              <field name="NUM">1</field>
            </shadow>
            <block type="math_arithmetic" id="S7=a6Do(/+sm!Oixet-9">
              <field name="OP">ADD</field>
              <value name="A">
                <shadow type="math_number" id="Wk-;!lqlRMx$\`/9\`q+W1">
                  <field name="NUM">1</field>
                </shadow>
                <block type="variables_get" id="\`0etc@tD|n.TM}f0DYyj">
                  <field name="VAR" id="zHLK1pJ)ha4:E*Un1gv_">firstDayOfMonth</field>
                </block>
              </value>
              <value name="B">
                <shadow type="math_number" id="%WjpQo@hJYuq?[r%S11n">
                  <field name="NUM">10</field>
                </shadow>
              </value>
            </block>
          </value>
          <value name="TO">
            <shadow type="math_number" id="e1%+qV)lA8G/e7@WdkRY">
              <field name="NUM">28</field>
            </shadow>
          </value>
        </block>
      </value>
      <next>
        <block type="variables_set" id="72e!OK!8%Sw~=?p+E9Or">
          <field name="VAR" id="e.).9(qlkLl^TxBJkcQX">secondDayOfMonth</field>
          <value name="VALUE">
            <block type="math_random_int" id="oW5eFm[\`4(k$J!C*(7Pl">
              <value name="FROM">
                <shadow type="math_number">
                  <field name="NUM">1</field>
                </shadow>
                <block type="math_arithmetic" id="UU[^L~sk=iz_{ie-8IC{">
                  <field name="OP">ADD</field>
                  <value name="A">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                    <block type="variables_get" id="X;.C?Cz,}[+zrqU%1[X?">
                      <field name="VAR" id="zHLK1pJ)ha4:E*Un1gv_">firstDayOfMonth</field>
                    </block>
                  </value>
                  <value name="B">
                    <shadow type="math_number" id="~7/MUsKatGi9+9%pVX?S">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
              </value>
              <value name="TO">
                <shadow type="math_number" id="CRBmW~ch5H\`\`(P:1-Q+\`">
                  <field name="NUM">28</field>
                </shadow>
                <block type="math_arithmetic" id="^4LPRv#)a23-_I)uU(49">
                  <field name="OP">MINUS</field>
                  <value name="A">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                    <block type="variables_get" id="1Df\`/d(=#xv5/Zk~W64%">
                      <field name="VAR" id="fZ3m*9T$0:_Q*D93f0zb">thirdDayOfMonth</field>
                    </block>
                  </value>
                  <value name="B">
                    <shadow type="math_number" id="aEFt^%vt2h$8riWnkLRA">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                </block>
              </value>
            </block>
          </value>
        </block>
      </next>
    </block>
  </next>
</block>
</xml>`;

app.get('/', async (req, res) => {
  // Type declaration isn't working for Blockly.JavaScript.
  // Possible solutions here:
  // https://github.com/google/blockly/issues/4742
  // https://github.com/google/blockly/issues/2995

  //@ts-ignore
  Blockly.JavaScript.addReservedWords('code,params');
  //@ts-ignore
  global.LoopTrap = 100;
  //@ts-ignore
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
    'if(--global.LoopTrap == 0) throw "Infinite loop.";\n';
  var xml = Blockly.Xml.textToDom(xmlText);
  var workspace = new Blockly.Workspace();
  Blockly.Xml.domToWorkspace(xml, workspace);

  // @ts-ignore
  var code = Blockly.JavaScript.workspaceToCode(workspace);

  const variables =
    (await xml2js.parseStringPromise(xmlText))?.xml?.variables ?? [];
  const variableNames = variables[0].variable.map(
    (v: any) => v._,
  ) as string[];

  const execute = `
      function generateVariables() {
        ${code}
        var params = {};
        ${variableNames.reduce((assign, variable) => {
          return (
            assign +
            `if ('undefined' !== typeof ${variable}) params['${variable}'] = ${variable};`
          );
        }, '')}
        return params;
      }
      global.params = generateVariables();
    `;

  try {
    eval(execute);
  } catch (e) {
    console.log('error', e);
  }

  // @ts-ignore
  res.send(global.params);
});

const PORT = process.env.PORT || 8100;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
