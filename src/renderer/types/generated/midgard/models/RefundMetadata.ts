// tslint:disable
/**
 * Midgard Public API
 * The Midgard Public API queries THORChain and any chains linked via the Bifröst and prepares information about the network to be readily available for public users. The API parses transaction event data from THORChain and stores them in a time-series database to make time-dependent queries easy. Midgard does not hold critical information. To interact with BEPSwap and Asgardex, users should query THORChain directly.
 *
 * The version of the OpenAPI document: 2.12.2
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    Coin,
} from './';

/**
 * @export
 * @interface RefundMetadata
 */
export interface RefundMetadata {
    /**
     * Transaction memo of the refund action
     * @type {string}
     * @memberof RefundMetadata
     */
    memo: string;
    /**
     * List of network fees associated to an action. One network fee is charged for each outbound transaction 
     * @type {Array<Coin>}
     * @memberof RefundMetadata
     */
    networkFees: Array<Coin>;
    /**
     * Reason for the refund
     * @type {string}
     * @memberof RefundMetadata
     */
    reason: string;
}
