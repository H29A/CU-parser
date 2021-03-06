import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ProductSchema = new Schema({
    sku: String,
    productid: String,
    name: String,
    url: String,
    gtin: String,
    price_ag: Number,
    oldprice_ag: Number,
    price_ag_ceiled: Number,
    price_ag_floored: Number,
    image_url: String,
    image_url_set: [String],
    award_url_set: [String],
    manufacturerid:	Number,
    manufacturer: String,
    manufacturerslug: String,
    ManufacturerPicture: String,
    timestamp_created: Date,
    categoryname: String,
    categorynames: [String],
    categoryid:	Number,
    categoryids: [Number],
    categorycuid: Number,
    categories_affinity: [String],
    hierarchicalCategories_ag: Object,
    tag_ids: [Number],
    publish_time: String,
    facets:	Object,
    show_in_outlet:	Boolean,
    facetsFilterOnly: Object,
    facetsSearchable: Array,
    additionalProperties: Array,
    manufacturerpartnumber:	String,
    parentproductid: String,
    parentsku: String,
    usedproduct: Boolean,
    deliverydateid: Number,
    discountinpercent: Boolean,
    crosssellingids: [Number],
    familyid: Number,
    familyname: String,
    producttypeid_ag: Number,
    energyclass: String,
    energyclassimage: String,
    datasheet: String,
    energyclassbadge: String,
    webtrekkviews: Number,
    webtrekkbuys: Number,
    productchannel:	Object,
    bulletpoints: String,
    tierprices: Object,
    bware_error_description: String,
    ratings_sum: String,
    ratings_reviewsapproved: String,
    ratings_average: String,
    streetday: Date,
    displayorder: Number,
    score: Number,
    popularity: Number,
    popularity_modified: Number,
    relevant_availability: Boolean,
    isparenteol: Boolean,
    childcount:	Number,
    attributefordistinct: String,
    originalproducturl: String,
    isnew: Boolean,
    deliverydatenow: Boolean,
    deliverydatepreorder: Boolean,
    streetdate: String,
    dateexpected: Date,
    tokens:	[String],
    hasPublicationReviews: Boolean,
    publicationReviewCount:	Number,
    publicationReviewLogos: Array,
    canPickupInStore: Boolean,
    objectID: String,
    _highlightResult: Object
});

export const Product = model('Category', ProductSchema);