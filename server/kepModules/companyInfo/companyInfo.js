/*
 * 客户的公司信息 （目前关联到公司注册业务下面）
 *
 **/
KCompanyInfo = {};

/*
 * 创建新的公司信息
 */
KCompanyInfo.createCompanyInfo = function (customerId, companyInfo) {
  companyInfo = companyInfo || {};

  // {
  //   company: {},
  //   holders:[],
  //   legalPerson:{},
  //   chairman: [],
  //   supervisor:{},
  //   manager: {},
  //   financialStaff: {},
  //   contractor: {}
  // };

  // checkCompanyInfo(companyInfo);
  check(customerId, String);

  KUtil.dataIsInColl({coll: Customers, dataId: customerId});

  companyInfo.customerId = customerId;
  log('KCompanyInfo.createCompanyInfo', companyInfo);
  return CompanyInfo.insert(companyInfo);
};


/*
 * 更新公司信息
 * 注意: 不可改变公司的从属的客户
 **/
KCompanyInfo.updateCompanyInfo = function (companyId, companyInfo) {
  check(companyId, String);
  // checkCompanyInfo(companyInfo);
  return CompanyInfo.update({_id: companyId}, {$set: companyInfo});
};


/*
 * 通过客户获取其相对的公司信息
 **/
KCompanyInfo.getCompanyInfoByCustomer = function (customerId) {
  check(customerId, String);
  return CompanyInfo.find({customerId: customerId});
}


// 检测公司的信息
function checkCompanyInfo(companyInfo) {
  check(companyInfo, {
      // customerId: Match.Maybe(String), // 不可改变公司的从属的客户
      company: Match.Maybe({ // 公司基本信息
        name: Match.Maybe(String),
        moneyAmount: Match.Maybe(Number),
        type: Match.Maybe(String),
        zone: Match.Maybe(String),
        address: Match.Maybe(String),
        productionAddress: Match.Maybe(String),
        companyId: Match.Maybe(String),
        businessPeriod: Match.Maybe(String),
        businessScope: Match.Maybe(String),
      }),
      holders: Match.Maybe([ // 股东
        {
          name: Match.Maybe(String),
          IDType: Match.Maybe(String),
          ID: Match.Maybe(String),
          investType: Match.Maybe(String),
          investShare: Match.Maybe(Number),
        }
      ]),
      legalPerson: Match.Maybe({  // 法人
        name: Match.Maybe(String),
        tel: Match.Maybe(String),
        phone: Match.Maybe(String),
        email: Match.Maybe(String),
        IDType: Match.Maybe(String),
        ID: Match.Maybe(String),
      }),
      chairman: Match.Maybe({ // 股东
        name: Match.Maybe(String),
        type: Match.Maybe(String), // 执行董事
        IDType: Match.Maybe(String),
        ID: Match.Maybe(String),
        phone: Match.Maybe(String),
      }),
      supervisor: Match.Maybe({ // 监事
        name: Match.Maybe(String),
        type: Match.Maybe(String),
        IDType: Match.Maybe(String),
        ID: Match.Maybe(String),
      }),
      manager: Match.Maybe({ // 经理
        name: Match.Maybe(String),
        type: Match.Maybe(String),
        IDType: Match.Maybe(String),
        ID: Match.Maybe(String),
      }),
      financialStaff: Match.Maybe({ // 财务负责人
        name: Match.Maybe(String),
        tel: Match.Maybe(String),
        phone: Match.Maybe(String),
        email: Match.Maybe(String),
        IDType: Match.Maybe(String),
        ID: Match.Maybe(String),
      }),
      contractor: Match.Maybe({ // 企业联络员
        name: Match.Maybe(String),
        phone: Match.Maybe(String),
        email: Match.Maybe(String),
        IDType: Match.Maybe(String),
        ID: Match.Maybe(String)
      })
  });
}
