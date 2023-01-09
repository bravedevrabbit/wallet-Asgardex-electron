// tslint:disable
/**
 * Thornode API
 * Thornode REST API.
 *
 * The version of the OpenAPI document: 1.102.0
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    KeygenMetric,
    KeysignMetrics,
} from './';

/**
 * @export
 * @interface MetricsResponse
 */
export interface MetricsResponse {
    /**
     * @type {Array<KeygenMetric>}
     * @memberof MetricsResponse
     */
    keygen?: Array<KeygenMetric>;
    /**
     * @type {KeysignMetrics}
     * @memberof MetricsResponse
     */
    keysign?: KeysignMetrics;
}
