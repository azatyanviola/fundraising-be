const companyDataMerge = ({
    airtableData,
    dbData
}) => {
    const mergeables = [
        "country",
        "type",
        "investmentIndustryOrTechnology",
        "stage",
        "investmentCountry",
        "ticketSize",
    ]
    const allFields = [
        ...mergeables,
        "range",
        "companyWebsideURL",
        "companyTwitterURL",
        "about",
        //"companyLogo",
        "recordID",
        "created"
    ]

    let updatedObj = {};

    const mergeFields = ({
        primData,
        secData
    }) => {
        let mergedData = []
        secData.forEach(item => {
            //if statement in case array includes strings
            if (!primData.includes(item)) {
                mergedData.push(item)
            }
            //when array items become objects instead of strings
            //change the if statement to this

            // if (!primData.includes(elem => elem.name === item)) {
            //     mergedData.push({
            //         name: item,
            //         votesCount: 0,
            //     })
            // }
        })
        return mergedData;
    }
    for (let key in airtableData) {
        //in case database has that field
        if (allFields.includes(key)) {
            if (dbData[key]) {
                //in case it's a mergeable field
                //handle merge 
                //otherwise ignore airtable field value
                if (mergeables.includes(key)) {
                    //merge data
                    let mergedData = mergeFields({
                        primData: dbData[key],
                        secData: airtableData[key]
                    })
                    if (mergedData.length) {
                        updatedObj[key] = [
                            ...mergedData,
                            ...dbData[key]
                        ]
                    }
                }
            }
            //in case database doesn't have the field
            //take the field from airtable
            else {
                updatedObj[key] = airtableData[key]
            }
        }
    }
    return updatedObj;
}

const peopleDataMerge = ({
    airtableData,
    dbData
}) => {
    const fields = [
        "position",
        "personLinkedIn",
        "personEmail",
        "personTwitter",
    ]
    let updatedObj = {}
    for (let key in airtableData) {
        if (!dbData[key]
            && fields.includes(key)) {
            updatedObj[key] = airtableData[key]
        }
    }
    return updatedObj;
}

module.exports = {
    companyDataMerge,
    peopleDataMerge
}



